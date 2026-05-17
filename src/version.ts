declare const __LIB_VERSION__: string;
declare const __LIB_BUILD_NUMBER__: number;
declare const __LIB_COMMIT__: string;
declare const __LIB_BUILD_DATE__: string;

export const LIB_VERSION: string = __LIB_VERSION__;
export const LIB_BUILD_NUMBER: number = __LIB_BUILD_NUMBER__;
export const LIB_COMMIT: string = __LIB_COMMIT__;
export const LIB_BUILD_DATE: string = __LIB_BUILD_DATE__;
export const LIB_BUILD_ID: string = `${LIB_BUILD_NUMBER}`;
