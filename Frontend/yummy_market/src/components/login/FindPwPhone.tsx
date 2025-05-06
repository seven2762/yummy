// 휴대폰 인증 UI 컴포넌트 (실제 기능은 미구현)
const FindPwPhone = () => (
    <div className="phone-verification-container">
      <form className="login_form mt-8">
        <div className="col-flex gap-10">
          <div>
            <label htmlFor="phone" className="gmarket-medium fc-888">
              휴대폰 번호
            </label>
            <div className="relative input_wrap row-flex-center between relative mt-1">
              <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="block pl-3 pr-3 prt-regular fs-18"
                  placeholder="010-0000-0000"
                  disabled
              />
              <button
                  type="button"
                  className="verification-btn prt-regular fs-14"
                  disabled
              >
                인증요청
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="verification-code" className="gmarket-medium fc-888">
              인증번호
            </label>
            <div className="relative input_wrap row-flex-center between relative mt-1">
              <input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  className="block pl-3 pr-3 prt-regular fs-18"
                  placeholder="인증번호 6자리"
                  disabled
              />
              <button
                  type="button"
                  className="verification-btn prt-regular fs-14"
                  disabled
              >
                확인
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 gmarket-medium fs-14 fc-888 txt-center">
          휴대폰 인증 기능은 현재 준비 중입니다.
        </div>

        <div>
          <button
              type="submit"
              disabled
              className="flex-center w-100 login_submit_btn mt-10 gmarket-medium fs-18 fc-ccc opacity-50"
          >
            비밀번호 찾기
          </button>
        </div>
      </form>
    </div>
);

export default FindPwPhone;
