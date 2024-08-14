<Modal
  title="Durum Güncelle"
  open={isColorModalVisible}
  onCancel={handleColorModalClose}
  footer={[
    <Button key="submit" onClick={handleSubmit(onSubmit)}>
      Kaydet
    </Button>,
    <Button key="ok" onClick={handleColorModalClose}>
      Kapat
    </Button>,
  ]}
>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: "408px",
      gap: "10px",
      rowGap: "0px",
      marginBottom: "10px",
    }}
  >
    <Text
      style={{
        fontSize: "14px",
        fontWeight: "600",
      }}
    >
      Durum İsmi:
    </Text>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "300px",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Controller name="durumIsim" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
    </div>
    <Controller name="durumID" control={control} render={({ field }) => <Input {...field} style={{ flex: 1, display: "none" }} />} />
  </div>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: "408px",
      gap: "10px",
      rowGap: "0px",
      marginBottom: "10px",
    }}
  >
    <Text style={{ fontSize: "14px" }}>Renk:</Text>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "300px",
          minWidth: "300px",
          gap: "10px",
          width: "100%",
        }}
      >
        <Controller
          name="durumRenk"
          control={control}
          render={({ field }) => (
            <ColorPicker
              value={field.value} // Ensure the current value is set
              onChange={(color, hex) => field.onChange(hex)} // Use hex value directly
              showText
            />
          )}
        />
      </div>
    </div>
  </div>
</Modal>;
