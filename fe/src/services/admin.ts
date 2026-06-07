import { useBoundStore } from '@/store/useBoundStore'
import { applySeedData } from '@/storage/seedData'

export function resetToSeed(): void {
  applySeedData(useBoundStore.getState())
}
