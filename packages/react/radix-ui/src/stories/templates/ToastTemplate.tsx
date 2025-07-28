import { useEffect } from "react"
import { toast } from "sonner"

import { CustomToast, CustomToastProps, Toast } from "@/components/ui"

export function ToastTemplate(props: CustomToastProps) {
  useEffect(() => {
    toast.custom((t) => <CustomToast {...props} type={props.type} t={t} />)
  })
  return (
    <Toast
      duration={props.duration}
      style={
        props.transitionDuration
          ? {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "--toast-transition-duration": `${props.transitionDuration}ms`,
            }
          : undefined
      }
    />
  )
}
