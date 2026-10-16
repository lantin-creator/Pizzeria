const Categories = (props) => {
  const {
    href = '',
    className = '',
    childrens,
    needAnIcon,
    classNameText = '',
    classNameCard,
    isButton = false,
    onClick,
  } = props;

  if (needAnIcon) {
    return (
      <a href={href}>
        <div className={classNameCard}>
          <div className={className}></div>
          <div className={classNameText}>{childrens}</div>
        </div>
      </a>
    );
  }

  if (isButton) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {childrens}
      </button>
    );
  }

  return (
    <a href={href}>
      <div className={className}>{childrens}</div>
    </a>
  );
};

export default Categories;