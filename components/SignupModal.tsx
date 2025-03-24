import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: SignupData) => void;
}

export interface SignupStep1Data {
  name: string;
  birthdate: string;
  gender: "남성" | "여성" | "";
}

export interface SignupStep2Data {
  phone: {
    first: string;
    middle: string;
    last: string;
  };
  email: {
    id: string;
    domain: string;
  };
}

export interface SignupStep3Data {
  password: string;
  passwordConfirm: string;
}

export interface SignupData {
  step1: SignupStep1Data;
  step2: SignupStep2Data;
  step3: SignupStep3Data;
}

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onNext,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    step1: {
      name: "",
      birthdate: "",
      gender: "",
    },
    step2: {
      phone: {
        first: "010",
        middle: "",
        last: "",
      },
      email: {
        id: "",
        domain: "",
      },
    },
    step3: {
      password: "",
      passwordConfirm: "",
    },
  });
  const [isMounted, setIsMounted] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      step1: {
        ...formData.step1,
        [name]: value,
      },
    });
  };

  const handleStep2PhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      step2: {
        ...formData.step2,
        phone: {
          ...formData.step2.phone,
          [name]: value,
        },
      },
    });
  };

  const handleStep2EmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      step2: {
        ...formData.step2,
        email: {
          ...formData.step2.email,
          [name]: value,
        },
      },
    });
  };

  const handleStep3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      step3: {
        ...formData.step3,
        [name]: value,
      },
    });

    // 비밀번호 확인 검증
    if (name === "passwordConfirm" || name === "password") {
      if (
        name === "password" &&
        formData.step3.passwordConfirm &&
        value !== formData.step3.passwordConfirm
      ) {
        setPasswordError("비밀번호가 일치하지 않습니다");
      } else if (
        name === "passwordConfirm" &&
        value !== formData.step3.password
      ) {
        setPasswordError("비밀번호가 일치하지 않습니다");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // 1단계에서 다음 버튼 클릭 시 2단계로 이동
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // 2단계에서 다음 버튼 클릭 시 3단계로 이동
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.step3.password !== formData.step3.passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다");
      return;
    }
    onNext(formData); // 3단계에서 가입하기 버튼 클릭 시 전체 데이터 제출
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1); // 2단계에서 1단계로 뒤로 가기
    } else if (step === 3) {
      setStep(2); // 3단계에서 2단계로 뒤로 가기
    }
  };

  if (!isOpen || !isMounted) return null;

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이름
        </label>
        <input
          type="text"
          name="name"
          placeholder="이름을 입력해주세요"
          value={formData.step1.name}
          onChange={handleStep1Change}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          생년월일
        </label>
        <input
          type="text"
          name="birthdate"
          placeholder="예) 19980909"
          value={formData.step1.birthdate}
          onChange={handleStep1Change}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          성별
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="남성"
              checked={formData.step1.gender === "남성"}
              onChange={handleStep1Change}
              className="mr-2"
              required
            />
            남성
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="여성"
              checked={formData.step1.gender === "여성"}
              onChange={handleStep1Change}
              className="mr-2"
            />
            여성
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-black text-white rounded-lg font-medium"
      >
        다음
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2Submit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          휴대전화 (선택)
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="first"
            placeholder="010"
            value={formData.step2.phone.first}
            onChange={handleStep2PhoneChange}
            className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="mx-2">-</span>
          <input
            type="text"
            name="middle"
            placeholder="1234"
            value={formData.step2.phone.middle}
            onChange={handleStep2PhoneChange}
            className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="mx-2">-</span>
          <input
            type="text"
            name="last"
            placeholder="5678"
            value={formData.step2.phone.last}
            onChange={handleStep2PhoneChange}
            className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이메일
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="id"
            placeholder="이메일"
            value={formData.step2.email.id}
            onChange={handleStep2EmailChange}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <span className="mx-2">@</span>
          <input
            type="text"
            name="domain"
            placeholder="도메인"
            value={formData.step2.email.domain}
            onChange={handleStep2EmailChange}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={goBack}
          className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
        >
          이전
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-black text-white rounded-lg font-medium"
        >
          다음
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3Submit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요"
          value={formData.step3.password}
          onChange={handleStep3Change}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호 확인
        </label>
        <input
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호를 다시 입력해주세요"
          value={formData.step3.passwordConfirm}
          onChange={handleStep3Change}
          className={`w-full p-3 border ${
            passwordError ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          required
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={goBack}
          className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
        >
          이전
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-black text-white rounded-lg font-medium"
        >
          가입하기
        </button>
      </div>
    </form>
  );

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 회원가입 헤더 */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-2xl mb-1">회원가입</h2>
            <p className="text-sm text-gray-500">간단하고 빠른 회원가입</p>
          </div>

          {/* 진행 상태 표시 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-full max-w-xs">
              {/* 1단계 */}
              <div className="relative">
                <div
                  className={`w-8 h-8 ${
                    step >= 1
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  } rounded-full flex items-center justify-center font-medium`}
                >
                  1
                </div>
              </div>
              {/* 연결선 */}
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div
                  className="h-full bg-black"
                  style={{ width: step >= 2 ? "100%" : "0%" }}
                ></div>
              </div>
              {/* 2단계 */}
              <div className="relative">
                <div
                  className={`w-8 h-8 ${
                    step >= 2
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  } rounded-full flex items-center justify-center font-medium`}
                >
                  2
                </div>
              </div>
              {/* 연결선 */}
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div
                  className="h-full bg-black"
                  style={{ width: step >= 3 ? "100%" : "0%" }}
                ></div>
              </div>
              {/* 3단계 */}
              <div className="relative">
                <div
                  className={`w-8 h-8 ${
                    step >= 3
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  } rounded-full flex items-center justify-center font-medium`}
                >
                  3
                </div>
              </div>
            </div>
          </div>

          {/* 회원가입 폼 */}
          {step === 1
            ? renderStep1()
            : step === 2
            ? renderStep2()
            : renderStep3()}
        </div>
      </div>
    </div>
  );

  // React Portal을 사용하여 모달을 body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default SignupModal;
