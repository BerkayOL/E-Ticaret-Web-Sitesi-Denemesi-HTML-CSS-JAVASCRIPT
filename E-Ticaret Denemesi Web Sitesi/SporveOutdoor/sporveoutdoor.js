let UrunList = [],
 SepetList=[];

 toastr.options = {
   closeButton: false,
   debug: false,
   newestOnTop: false,
   progressBar: false,
   positionClass: "toast-bottom-right",
   preventDuplicates: false,
   onclick: null,
   showDuration: "300",
   hideDuration: "1000",
   timeOut: "5000",
   extendedTimeOut: "1000",
   showEasing: "swing",
   hideEasing: "linear",
   showMethod: "fadeIn",
   hideMethod: "fadeOut"
 };

const Sepet = () =>{
    const SepetUrunleri = document.querySelector(".sepet__ekleme");
    SepetUrunleri.classList.toggle("active");
    };

const getUrun = () => {

    fetch("./SporveOutdoor/sporveoutdoor.json")
    .then((res) => res.json())
    .then((urun)=>(UrunList = urun ));
};

getUrun();

const createProductStars = (StarRate) => {
    let StarRateHTML = ``;
    for(let i = 1; i <= 5; i++){
        if(Math.round(StarRate) >= i)
         StarRateHTML += `<i class="bi bi-star-fill active"></i>`;
        else StarRateHTML += `<i class="bi bi-star-fill"></i>`;
    }
    return  StarRateHTML;
};

const createproductItemsHTML = () => {
    const ProductListEL = document.querySelector(".product__list");
    let ProductListHTML = "";
    UrunList.forEach((product, index ) => {
        ProductListHTML += `<div class="col-5 ${index % 2  == 2 && "offset-2"} mb-1">
                        <div class="row card">
                        <div class="col-6">
                        <img class="kıyafet1 img-fluid shadow" src="${product.imgSource}"
                        />
                    </div>
                    <div class="col-6 d-flex flex-column justify-content-between">
                        <div class="detail d-flex flex-column justify-content-between">
                            <span class="font gray fs-5 ">${product.details}</span><br/>
                            <span class="fs-4 fw-bold">${product.name}</span><br/>
                            <span class="rate">
                              ${createProductStars(product.starRate)}
                          
                            <span class="gray">${product.reviewCount} review
                            </span>
                            </span>
                        </div>
                    <div class="fiyat">
                        <span class="black fs-4 fw-bold">${product.price}₺</span>
                        ${product.oldPrice ? `<span class="gray fs-4 fw-bold text-decoration-line-through">${product.oldPrice}₺</span>`
                            : ""
                        }
                    </div>
                    <button class="button" onclick="sepete__ekleme(${product.id})">Sepete Ekle</button>
                </div>
                </div>
                </div>
                </div>`;
    });
    ProductListEL.innerHTML = ProductListHTML;
    
};
    const listBasketItems = () => {
        localStorage.setItem("SepetList", JSON.stringify(SepetList));
        const basketlistel = document.querySelector(".sepet__listeleme");
        const basketcountel = document.querySelector(".sepet")
        basketcountel.innerHTML = SepetList.length > 0 ? SepetList.length : null;
        const ToplamTutarEl = document.querySelector(".toplam_fiyat");
        let BasketListHTML = "";
        let ToplamTutar  = 0 ;
        SepetList.forEach((item) => { 
            ToplamTutar += item.urunler.price * item.quantity;
            BasketListHTML += `<li class="sepet_icerigi">
                            <img
                             src="${item.urunler.imgSource}" 
                             width="100" 
                             height="100"
                             />
                            <div class="ürün__bilgileri">
                                <h3 class="ürün_adi">${item.urunler.name}</h3>
                                <span class="fiyat">${item.urunler.price}TL</span><br/>
                                <span class="sil" onclick="sepettensilme(${item.urunler.id})">sil</span>
                            </div>
                            <div class="deger">
                                <span class="azaltma" onclick="azaltma(${item.urunler.id})">-</span>
                                <span class="my-5">${item.quantity}</span>
                                <span class="cogaltma" onclick="cogaltma(${item.urunler.id})">+</span>
                            </div>
                        </li>`;
        })
        basketlistel.innerHTML = BasketListHTML ? BasketListHTML : `<li class="sepet_icerigi">
                           Herhangi bir ürün seçimi yapmadınız.
                        </li>`;
        ToplamTutarEl.innerHTML = ToplamTutar > 0 ? "Toplam :"+ ToplamTutar.toFixed(2)+ "₺": null;
    };

    const sepete__ekleme = (productid) => {
        let findedUrun  =   UrunList.find((product) => product.id == productid);
        if(findedUrun){
            const SepetAlreadyIndex = SepetList.findIndex(
                (basket) => basket.urunler.id == productid
        );
        if(SepetAlreadyIndex == -1){
            let addItem = {quantity: 1, urunler : findedUrun}
            SepetList.push(addItem);
        }else{
            if(SepetList[SepetAlreadyIndex].quantity <
                 SepetList[SepetAlreadyIndex].urunler.stock)

             SepetList[SepetAlreadyIndex].quantity += 1;
             else {toastr.error("Üzgünüm,stok sınırına ulaştınız.");
             return;
             }
        }
        listBasketItems();
        toastr.success("Ürün Başarıyla eklendi.")
        }
};

    const sepettensilme = (productid) => {
        const findedindex = SepetList.findIndex((basket) => basket.urunler.id == productid);
        if(findedindex != -1){
            SepetList.splice(findedindex,1);
        }
        listBasketItems();
    };

const azaltma = (productid) => {
    const findedindex = SepetList.findIndex((basket) => basket.urunler.id == productid);
    if(findedindex != -1){
        if(SepetList[findedindex].quantity !=1)
            SepetList[findedindex].quantity -= 1;
        else sepettensilme(productid);
        listBasketItems();
    }
  
};
const cogaltma = (productid) => {
    const findedindex = SepetList.findIndex(
        (basket) => basket.urunler.id == productid);
    if(findedindex != -1){
        if(
            SepetList[findedindex].quantity < SepetList[findedindex].urunler.stock
        )
            SepetList[findedindex].quantity += 1;
        else toastr.error("Üzgünüm,stok sınırına ulaştınız.");
        listBasketItems();
    }
    
};
if(localStorage.getItem("SepetList")){
    SepetList =JSON.parse(localStorage.getItem("SepetList")); 
    listBasketItems();
 }
toastr.info("Şu anda Spor&Outdoor Kategorisindesiniz.")

setTimeout(() => {
    createproductItemsHTML();
}, 100);

