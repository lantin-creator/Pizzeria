const Cards = ({
  classNameCard = "",
  Name = "",
  childName = "",
  Img1 = "",
  Img2 = "",
  Price = "",
  childPrice = "",
  Choose = "",
  image1,
  image2,
  onChoose,
  disabled = false,
  buttonText = "Выбрать",
}) => {
  return (
    <div className={classNameCard}>
      <div className={Name}>{childName}</div>

      <div
        className={Img1}
        style={{
          backgroundImage: image1 ? `url("${image1}")` : "none",
        }}
      />

      {Img2 && (
        <div
          className={Img2}
          style={{
            backgroundImage: image2 ? `url("${image2}")` : "none",
          }}
        />
      )}

      <div className={Price}>{childPrice}</div>

      <button
        type="button"
        className={Choose}
        onClick={onChoose}
        disabled={disabled}
        style={{ border: "none", padding: 0 }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Cards;
