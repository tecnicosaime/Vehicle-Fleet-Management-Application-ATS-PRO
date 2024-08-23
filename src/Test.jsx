const recalculateIndirimOrani = () => {
  const values = getValues();

  const miktar = values.miktar || 1;
  const iscilikUcreti = (values.iscilikUcreti || 0) * miktar;
  const indirimYuzde = values.indirimYuzde || 0;

  const calculatedIndirimOrani = (iscilikUcreti * indirimYuzde) / 100;
  setValue("indirimOrani", isNaN(calculatedIndirimOrani) ? 0 : calculatedIndirimOrani);
};

const recalculateIndirimYuzde = () => {
  const values = getValues();

  const miktar = values.miktar || 1;
  const iscilikUcreti = (values.iscilikUcreti || 0) * miktar;
  const indirimOrani = values.indirimOrani || 0;

  const calculatedIndirimYuzde = (indirimOrani / iscilikUcreti) * 100;
  setValue("indirimYuzde", isNaN(calculatedIndirimYuzde) ? 0 : calculatedIndirimYuzde);
};

const recalculateToplam = () => {
  const values = getValues();

  const miktar = values.miktar || 1;
  const iscilikUcreti = (values.iscilikUcreti || 0) * miktar;
  const indirimOrani = values.indirimOrani || 0;
  const kdvOrani = values.kdvOrani || 0;

  if (!iscilikUcreti || iscilikUcreti <= 0) {
    setValue("kdvDegeri", 0);
    setValue("toplam", 0);
  } else {
    const remainingAmount = iscilikUcreti - (indirimOrani || 0);
    const kdv = remainingAmount * (kdvOrani / 100);
    const finalAmount = remainingAmount + kdv;

    setValue("kdvDegeri", isNaN(kdv) ? 0 : kdv);
    setValue("toplam", isNaN(finalAmount) ? 0 : finalAmount);
  }
};
