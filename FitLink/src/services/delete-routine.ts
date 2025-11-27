import { Alert, Platform } from 'react-native';
import { supabase } from './supabase';

interface DeleteRoutineParams {
  routineId: string;
  onSuccess: () => void;
}

export async function deleteRoutine({ routineId, onSuccess }: DeleteRoutineParams): Promise<void> {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta rutina?');
    
    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('routine_id', routineId);

      if (error) {
        console.error('Error eliminando rutina:', error);
        alert('Error: No se pudo eliminar la rutina');
        return;
      }

      alert('La rutina se eliminó correctamente');
      onSuccess();
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error: Ocurrió un error al eliminar la rutina');
    }
  } else {
    Alert.alert(
      "Eliminar rutina",
      "¿Estás seguro de que deseas eliminar esta rutina?",
      [
        { 
          text: "Cancelar", 
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            (async () => {
              try {
                const { error } = await supabase
                  .from('routines')
                  .delete()
                  .eq('routine_id', routineId);

                if (error) {
                  console.error('Error eliminando rutina:', error);
                  Alert.alert('Error', 'No se pudo eliminar la rutina');
                  return;
                }

                Alert.alert(
                  'Éxito', 
                  'La rutina se eliminó correctamente',
                  [
                    {
                      text: 'OK',
                      onPress: onSuccess
                    }
                  ]
                );
              } catch (err) {
                console.error('Error inesperado:', err);
                Alert.alert('Error', 'Ocurrió un error al eliminar la rutina');
              }
            })();
          }
        }
      ]
    );
  }
}
