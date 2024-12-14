import Toast from '@/components/Toast'

export async function asyncTaskWithToast({beginText, doneText}, task, cb) {
  Toast.show(beginText)
  try{
    await task
    Toast.show(doneText)
    cb?.()
  }catch(e) {
    Toast.show(e.message)
  }
}
