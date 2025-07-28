/// <reference types="vuetify" />

// 타입 정의 파일 가져오기
import { createVuetify, Vuetify, VuetifyOptions } from './src/types';

// 타입 내보내기
export * from './src/types/components';
export * from './src/types/directives';
export { createVuetify, Vuetify, VuetifyOptions };

// 전역 타입 확장
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $vuetify: Vuetify;
    }
}
