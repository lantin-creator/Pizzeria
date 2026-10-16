const Cards = (props) =>{
const {
    classNameCard = '',
    Name = '',
    childName = '',
    Img1 = '',
    Img2 = '',
    Price = '',
    childPrice = '',
    Choose = '',
    Combo = false,
} = props
    return(
        <div className={classNameCard}>
            <div className={Name}>{childName}</div>
            <div className={Img1}></div>
            {Combo && <div className={Img2}></div>}
            <div className={Price}>{childPrice}</div>
            <div className={Choose}>Выбрать</div>
          </div>
    )
}

export default Cards