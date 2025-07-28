#!/bin/env python3

from PIL import Image
import os
import sys


def trim_transparent_image(input_path, output_path):
    """
    PNG 이미지의 투명한 여백을 제거하고 저장합니다.

    :param input_path: 원본 이미지 파일 경로
    :param output_path: 결과물을 저장할 파일 경로
    """
    try:
        # 이미지를 엽니다.
        image = Image.open(input_path)
    except FileNotFoundError:
        print(f"오류: 파일을 찾을 수 없습니다 - {input_path}")
        return

    # RGBA 모드가 아니면 변환하여 알파 채널을 확보합니다.
    if image.mode != "RGBA":
        image = image.convert("RGBA")

    # 이미지의 내용이 있는 부분의 경계 상자(bounding box)를 가져옵니다[5].
    # 이 메서드는 투명하지 않은 픽셀이 있는 최소 영역의 (left, top, right, bottom) 좌표를 반환합니다.
    bbox = image.getbbox()

    if bbox:
        # 경계 상자를 이용해 이미지를 자릅니다[4][5].
        cropped_image = image.crop(bbox)

        # 잘라낸 이미지를 저장합니다.
        cropped_image.save(output_path, "PNG")
        print(f"성공: 투명 여백이 제거된 이미지를 '{output_path}'에 저장했습니다.")
        print(f"원본 크기: {image.size}, 변경된 크기: {cropped_image.size}")
    else:
        # 이미지가 전체적으로 투명할 경우
        print(
            f"경고: '{input_path}' 이미지는 내용이 없거나 전체가 투명합니다. 작업을 진행하지 않습니다."
        )


if __name__ == "__main__":
    if len(sys.argv) <= 1:
        print(
            f"사용법: python {os.path.basename(__file__)} [입력 이미지 파일 경로] [출력 이미지 파일 경로]"
        )
        sys.exit(1)

    # --- 설정 ---
    # 여기에 원본 이미지 파일 경로를 입력하세요.
    input_image_path = sys.argv[1]
    input_image_file_without_ext = os.path.splitext(input_image_path)[0]

    # 여기에 저장할 결과 이미지 파일 경로를 입력하세요.
    output_image_path = f"{input_image_file_without_ext}_cropped.png"
    # ------------

    # 스크립트 실행 시 명령줄 인수가 있으면 해당 인수를 사용합니다.
    # 사용법: python your_script_name.py input.png output.png
    if len(sys.argv) == 3:
        input_image_path = sys.argv[1]
        output_image_path = sys.argv[2]

    trim_transparent_image(input_image_path, output_image_path)
