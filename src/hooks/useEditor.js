import {useShareState} from '@/hooks/useShareState'

export function useEditor() {
  return useShareState('useEditorStore', false)
}
