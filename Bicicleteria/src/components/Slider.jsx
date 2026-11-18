import "./Slider.css"; 

function Slider() {
    return (
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">

            <div className="carousel-inner">

                <div className="carousel-item active" data-bs-interval="2000">
                    <img
                        src="/banner2.png"
                        className="d-block w-100 slider-img"
                        alt="Bicicleta de montaña"
                    />
                </div>

                <div className="carousel-item" data-bs-interval="4000">
                    <img
                        src="/banner3.png"
                        className="d-block w-100 slider-img"
                        alt="Accesorios para bicicletas"
                    />
                </div>

                <div className="carousel-item" data-bs-interval="6000">
                    <img
                        src="/banner4.png"
                        className="d-block w-100 slider-img"
                        alt="Productos de ciclismo"
                    />
                </div>

            </div>

            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>

                <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="1" aria-label="Slide 2"></button>

                <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
            </button>

        </div>
    );
}

export default Slider;
