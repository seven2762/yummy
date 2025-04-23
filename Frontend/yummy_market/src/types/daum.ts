// src/types/daum.ts
export {}; // 이 파일을 모듈로 만들기 위한 빈 export 문

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

export interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
  jibunAddress: string;
  roadAddress: string;
  apartment: string;
  userSelectedType: string;
}