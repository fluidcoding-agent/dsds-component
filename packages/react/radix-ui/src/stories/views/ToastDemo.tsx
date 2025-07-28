import { toast } from "sonner"

import { Button, CustomToast, CustomToastProps, Toast } from "@/components/ui"

export function ToastDemo(props: CustomToastProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <Button
        className="w-[100px]"
        onClick={() =>
          //   toast("dd", { cancel: { label: "Cancel", onClick: () => console.log("cancel") } })
          toast.custom((t) => (
            <CustomToast
              {...props}
              title="타이틀 성공"
              body="시작일로부터 60일 이내 데이터가 다운로드 되었습니다."
              link="/"
              type="success"
              t={t}
            />
          ))
        }
      >
        Success
      </Button>
      <Button
        className="w-[100px]"
        variant="danger"
        onClick={() =>
          //   toast("dd", { cancel: { label: "Cancel", onClick: () => console.log("cancel") } })
          toast.custom((t) => (
            <CustomToast
              {...props}
              title="타이틀 실패"
              body="시작일로부터 60일 이내 데이터가 다운로드 되었습니다."
              link="/"
              type="fail"
              t={t}
            />
          ))
        }
      >
        Fail
      </Button>
      <Button
        className="w-[100px]"
        variant="warning"
        onClick={() =>
          //   toast("dd", { cancel: { label: "Cancel", onClick: () => console.log("cancel") } })
          toast.custom((t) => (
            <CustomToast
              {...props}
              title="타이틀 경고"
              body="시작일로부터 60일 이내 데이터가 다운로드 되었습니다."
              link="/"
              type="warning"
              t={t}
            />
          ))
        }
      >
        Warning
      </Button>
      <Button
        className="w-[100px]"
        variant="secondary"
        onClick={() =>
          //   toast("dd", { cancel: { label: "Cancel", onClick: () => console.log("cancel") } })
          toast.custom((t) => (
            <CustomToast
              {...props}
              title="타이틀 정보"
              body="시작일로부터 60일 이내 데이터가 다운로드 되었습니다."
              link="/"
              type="inform"
              t={t}
            />
          ))
        }
      >
        Inform
      </Button>

      <Toast />
    </div>
  )
}
