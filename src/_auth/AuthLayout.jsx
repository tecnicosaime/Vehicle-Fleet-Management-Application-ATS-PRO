import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Button, Input, message, Spin, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { LoginUserService } from "../api/service";
import { setItemWithExpiration } from "../utils/expireToken";
import SuccessAlert from "../components/alerts/SuccessAlert";
import ErrorAlert from "../components/alerts/ErrorAlert";
import LanguageSelectbox from "../_root/components/lang/LanguageSelectbox.jsx";

const { Text } = Typography;

const AuthLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const body = {
      KULLANICIKOD: data.username,
      SIFRE: data.password,
    };

    try {
      const response = await LoginUserService(body);
      if (response?.data.accessToken) {
        setIsSuccess(true);
        setItemWithExpiration("token", response?.data.accessToken, 24, response?.data.siraNo);
        navigate("/");
      }
      if (response?.data.siraNo === 0) {
        message.error("Kullanıcı adı veya şifre hatalıdır.");
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      {/* alert messages */}
      {isSuccess && <SuccessAlert />}
      {isError && <ErrorAlert />}

      <div className="grid h-full">
        <div className="col-span-5 login-card" style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "450px" }}>
            <div style={{ marginBottom: "70px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <img src="/images/ats_pro_logo.png" alt="ats logo" className="login-logo-img self-center" />
                <LanguageSelectbox />
              </div>
              <Text>{t("filoYonetimiYazilimi")}</Text>
            </div>

            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
                <Text style={{ fontSize: "23px", fontWeight: 600 }}>{t("Giris")} !</Text>
                <Text>{t("hosGeldinizKullaniciKoduVeSifreniziGiriniz")}</Text>
              </div>

              <div style={{ display: "flex", gap: "5px", flexDirection: "column" }} className="mt-30">
                <Text>{t("KullaniciKodu")}</Text>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: t("usernameValidationErrorMessage") }}
                  render={({ field }) => <Input {...field} placeholder={t("username")} className={errors.username ? "border-red-500" : null} />}
                />
                {errors.username && <span className="error-message">{errors.username.message}</span>}
              </div>
              <div style={{ display: "flex", gap: "5px", flexDirection: "column" }} className="mt-30 mb-20">
                <Text>{t("Sifre")}</Text>

                <Controller
                  name="password"
                  control={control}
                  rules={{ required: t("passwordValidationErrorMessage") }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      style={{ height: "40px", display: "flex", alignItems: "center" }}
                      placeholder={t("password")}
                      type={showPassword ? "text" : "password"}
                      suffix={showPassword ? <EyeTwoTone onClick={() => setShowPassword(false)} /> : <EyeInvisibleOutlined onClick={() => setShowPassword(true)} />}
                      className={errors.username ? "border-red-500" : null}
                    />
                  )}
                />
                {errors.password && <span className="error-message">{errors.password.message}</span>}
              </div>
              <div className="flex justify-end mb-20">
                <Link to={""} className="login-forget-link">
                  {t("forgotPassword")}
                </Link>
              </div>
              <Button type="submit" onClick={handleSubmit(onSubmit)} className="login-btn btn mt-6">
                {isLoading ? <Spin className="text-white" /> : t("login")}
              </Button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", bottom: "20px" }}>
            <img src="/images/orjinLogo.png" alt="ats logo" style={{ width: "150px" }} className="login-logo-img self-center" />
          </div>
        </div>
        <div className="login-bg-image col-span-7">
          <div className="bg-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

// password pattern --> pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
// username pattern --> pattern: /^[a-zA-Z0-9_]+$/
