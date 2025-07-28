// packages/vuetify/src/types/index.d.ts
import { App } from 'vue';
import { VuetifyOptions as OriginalVuetifyOptions } from 'vuetify';

// Vuetify 옵션 타입 재정의
export interface VuetifyOptions extends OriginalVuetifyOptions { }

// createVuetify 함수 타입 정의
export function createVuetify(options?: VuetifyOptions): {
    install: (app: App) => void;
};

// Vuetify 인스턴스 타입 정의
export interface Vuetify {
    defaults: Record<string, any>;
    display: any;
    theme: any;
    icons: any;
    locale: any;
}

// 전역 속성 확장
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $vuetify: Vuetify;
    }
}
