/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Platform } from 'react-native';
import { deleteRoutine } from '../../src/services/delete-routine';
import { supabase } from '../../src/services/supabase';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('deleteRoutine', () => {
  const mockOnSuccess = jest.fn();
  const mockRoutineId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Web Platform', () => {
    beforeEach(() => {
      (Platform as any).OS = 'web';
      global.confirm = jest.fn();
      global.alert = jest.fn();
    });

    it('should show confirmation dialog on web', async () => {
      (global.confirm as jest.Mock).mockReturnValue(false);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(global.confirm).toHaveBeenCalledWith(
        '¿Estás seguro de que deseas eliminar esta rutina?'
      );
    });

    it('should not delete if user cancels confirmation on web', async () => {
      (global.confirm as jest.Mock).mockReturnValue(false);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(mockSupabase.from).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should delete routine successfully on web when confirmed', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(mockSupabase.from).toHaveBeenCalledWith('routines');
      expect(mockDelete).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('La rutina se eliminó correctamente');
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should call delete with correct routine_id on web', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(mockEq).toHaveBeenCalledWith('routine_id', mockRoutineId);
    });

    it('should handle delete error on web', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockError = { message: 'Database error', code: '500' };
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: mockError }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(console.error).toHaveBeenCalledWith('Error eliminando rutina:', mockError);
      expect(global.alert).toHaveBeenCalledWith('Error: No se pudo eliminar la rutina');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle unexpected error on web', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockError = new Error('Unexpected error');
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(mockError),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(console.error).toHaveBeenCalledWith('Error inesperado:', mockError);
      expect(global.alert).toHaveBeenCalledWith('Error: Ocurrió un error al eliminar la rutina');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Mobile Platform (iOS/Android)', () => {
    beforeEach(() => {
      (Platform as any).OS = 'ios';
    });

    it('should show Alert confirmation dialog on mobile', async () => {
      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Eliminar rutina',
        '¿Estás seguro de que deseas eliminar esta rutina?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancelar', style: 'cancel' }),
          expect.objectContaining({ text: 'Eliminar', style: 'destructive' }),
        ])
      );
    });

    it('should not delete if user cancels on mobile', async () => {
      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      // No se llama a supabase porque no se presionó el botón eliminar
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('should delete routine successfully on mobile when confirmed', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      // Obtener el callback del botón Eliminar
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Eliminar');
      
      // Ejecutar el callback
      await deleteButton.onPress();

      expect(mockSupabase.from).toHaveBeenCalledWith('routines');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should call onSuccess after successful delete on mobile', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Eliminar');
      await deleteButton.onPress();

      // Verificar que se muestra el Alert de éxito
      expect(Alert.alert).toHaveBeenCalledWith(
        'Éxito',
        'La rutina se eliminó correctamente',
        expect.arrayContaining([
          expect.objectContaining({ text: 'OK' }),
        ])
      );

      // Ejecutar el callback del botón OK
      const successAlertCall = (Alert.alert as jest.Mock).mock.calls[1];
      const okButton = successAlertCall[2][0];
      okButton.onPress();

      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should use correct routine_id on mobile', async () => {
      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: '456', onSuccess: mockOnSuccess });

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Eliminar');
      await deleteButton.onPress();

      expect(mockEq).toHaveBeenCalledWith('routine_id', '456');
    });

    it('should handle delete error on mobile', async () => {
      const mockError = { message: 'Database error', code: '500' };
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: mockError }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Eliminar');
      await deleteButton.onPress();

      expect(console.error).toHaveBeenCalledWith('Error eliminando rutina:', mockError);
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo eliminar la rutina');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle unexpected error on mobile', async () => {
      const mockError = new Error('Unexpected error');
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(mockError),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Eliminar');
      await deleteButton.onPress();

      expect(console.error).toHaveBeenCalledWith('Error inesperado:', mockError);
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ocurrió un error al eliminar la rutina');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should work on Android platform', async () => {
      (Platform as any).OS = 'android';

      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Eliminar rutina',
        '¿Estás seguro de que deseas eliminar esta rutina?',
        expect.any(Array)
      );
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      (Platform as any).OS = 'web';
      global.confirm = jest.fn();
      global.alert = jest.fn();
    });

    it('should handle empty routineId', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: '', onSuccess: mockOnSuccess });

      expect(mockEq).toHaveBeenCalledWith('routine_id', '');
    });

    it('should handle multiple calls to deleteRoutine', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: '1', onSuccess: mockOnSuccess });
      await deleteRoutine({ routineId: '2', onSuccess: mockOnSuccess });

      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
      expect(mockOnSuccess).toHaveBeenCalledTimes(2);
    });

    it('should not call onSuccess if deletion fails', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);

      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: { message: 'Failed' } }),
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      } as any);

      await deleteRoutine({ routineId: mockRoutineId, onSuccess: mockOnSuccess });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
