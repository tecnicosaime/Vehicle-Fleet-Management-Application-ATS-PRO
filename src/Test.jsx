const onSubmit = handleSubmit((values) => {
  const body = {
    aracId: plaka[0].aracId,
    surucuId1: values.surucuId1 || 0,
    surucuId2: values.surucuId2 || 0,
    aciklama: values.aciklama,
    seferNo: values.seferNo,
    dorseId: values.dorseId || 0,
    guzergahId: values.guzergahId || 0,
    seferTipKodId: values.seferTipKodId || 0,
    seferDurumKodId: values.seferDurumKodId || 0,
    cikisTarih: dayjs(values.cikisTarih).format("YYYY-MM-DD"),
    varisTarih: dayjs(values.varisTarih).format("YYYY-MM-DD"),
    cikisSaat: dayjs(values.cikisSaat).format("HH:mm:ss"),
    varisSaat: dayjs(values.varisSaat).format("HH:mm:ss"),
    seferAdedi: values.seferAdedi || 0,
    cikisKm: values.cikisKm || 0,
    varisKm: values.varisKm || 0,
    farkKm: values.farkKm || 0,
    ozelAlan1: values.ozelAlan1 || "",
    ozelAlan2: values.ozelAlan2 || "",
    ozelAlan3: values.ozelAlan3 || "",
    ozelAlan4: values.ozelAlan4 || "",
    ozelAlan5: values.ozelAlan5 || "",
    ozelAlan6: values.ozelAlan6 || "",
    ozelAlan7: values.ozelAlan7 || "",
    ozelAlan8: values.ozelAlan8 || "",
    ozelAlanKodId9: values.ozelAlanKodId9 || 0,
    ozelAlanKodId10: values.ozelAlanKodId10 || 0,
    ozelAlan11: values.ozelAlan11 || 0,
    ozelAlan12: values.ozelAlan12 || 0,
  };

  setLoading(true);
  AddExpeditionItemService(body).then((res) => {
    if (res?.data.statusCode === 200) {
      setStatus(true);
      setIsOpen(false);
      setLoading(false);
      setActiveKey("1");
      if (plaka.length === 1) {
        reset();
      } else {
        reset();
      }
      setIsValid("normal");
    } else {
      message.error("Bir sorun oluşdu! Tekrar deneyiniz.");
    }
  });
  setStatus(false);
});

return (
  <>
    <Button className="btn primary-btn" onClick={() => setIsOpen(true)}>
      <PlusOutlined /> {t("ekle")}
    </Button>
    <Modal title={t("yeniSeferGirisi")} open={isOpen} onCancel={() => setIsOpen(false)} maskClosable={false} footer={footer} width={1200}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          {" "}
          {/* onSubmit ekledik */}
          <Tabs activeKey={activeKey} onChange={setActiveKey} items={items} />
        </form>
      </FormProvider>
    </Modal>
  </>
);
