import { Button, MessageModal, MessageModalProps, Modal, ModalCheckbox, ModalClose, ModalProps } from "@/components/ui"

export type ModalTemplateProps = Pick<ModalProps, "title" | "size" | "content"> &
  Pick<MessageModalProps, "message"> & {
    isMessage?: boolean
  }

const trigger = <Button children="Open Modal" size="large" variant="secondary" />
const footerMessage = (
  <div className="flex h-[60px] w-full flex-row justify-between">
    <div className="flex items-center">
      <ModalCheckbox id="1" label="오늘 하루종일 표현 안 함." />
    </div>
    <ModalClose>
      <Button variant="secondary" className="h-[28px] w-[48px]">
        닫기
      </Button>
    </ModalClose>
  </div>
)
const footerForm = (
  <div className="flex h-[60px] flex-row justify-between">
    <div className="flex items-center">
      <ModalCheckbox id="1" label="text" />
      <ModalCheckbox id="2" label="text" />
    </div>
    <ModalClose>
      <Button variant="secondary">닫기</Button>
    </ModalClose>
  </div>
)

export function ModalTemplate({ isMessage, title, size, content, message }: ModalTemplateProps) {
  return (
    <div>
      {isMessage ? (
        <MessageModal defaultOpen message={message} trigger={trigger} footer={footerMessage} />
      ) : (
        <Modal defaultOpen title={title} size={size} content={content} trigger={trigger} footer={footerForm} />
      )}
    </div>
  )
}
