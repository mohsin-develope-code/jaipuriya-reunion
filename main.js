
        
        //--------------------------------------------
        //             Key & Backend url
        //--------------------------------------------


        const KEY_ID = 'rzp_test_RmjDo8lq7GTEsp';   
         const BACKEND_URL = 'https://api.ultimatejaipurians.in';  
        //const BACKEND_URL = 'http://localhost:8000'  





        //-------------------------------
        //       Vanue Cards PopUp 
        //-------------------------------

        const overlay = document.getElementById("eventPopupOverlay");
const closeBtn = document.getElementById("eventPopupClose");

// Popup text elements
const titleEl = document.getElementById("popupTitle");
const dateEl = document.getElementById("popupDate");
const timeEl = document.getElementById("popupTime");
const popupIcon = document.getElementById("popupIcon");

// All cards
const cards = document.querySelectorAll(".eventPopupTrigger");
const openMap = document.getElementById('openMap');

// When clicking any card
cards.forEach(card => {
  card.addEventListener("click", () => {

    titleEl.textContent = card.dataset.title;
    dateEl.textContent = card.dataset.date;
    timeEl.textContent = card.dataset.time;
    popupIcon.innerHTML = `<i id="popupIcon" data-lucide="${card.dataset.icon}" style="width:24px;height:24px;"></i>`



    const title = titleEl.textContent;

     if(title === 'Where?'){
       openMap.style.display = 'flex'
       openMap.setAttribute("href", 'https://maps.app.goo.gl/DSnifjemDkRE39xM9?g_st=aw')
     }

    // re-render lucide icons
    requestAnimationFrame(() => lucide.createIcons());

    overlay.style.display = "flex";
  });
});


const popIcon = document.getElementById('popupIcon');

// Close popup
closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  openMap.style.display = 'none';
  popIcon.setAttribute("data-lucide", '');
});

// Click outside to close
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
    openMap.style.display = 'none'
  }

});




          //------------------------------------
          //     Photo Pop Up Open Logic
          //------------------------------------

             function openPopPhoto(imgSrc){
	            document.getElementById("popup-photo-img").src = imgSrc;
	            document.getElementById("popup-photo").style.display = "flex";

	            function closePopup() {
                document.getElementById("popup-photo").style.display = "none";
                }

               document.getElementById("popup-photo").addEventListener("click", (e) => {
                if (e.target.id === "popup-photo") closePopup();
               });

             }





          // ---------------------------
          //           Loader
          //--------------------------
          const button = document.getElementById("downloadBtn");

           button.addEventListener("click", () => {
             // show loader
             button.classList.add("loading");
           });

          


         //----------------------------------------------
         //      Change No. of People Compilation        
         //----------------------------------------------  

        const input= document.querySelectorAll(".someone-check");

         input.forEach(el => {
          el.addEventListener('change', function () {
            
            if (this.checked) {
                let selectedValue = this.value;

                const peopleChange = document.getElementById('attend');

                if(selectedValue === 'stag'){
                   peopleChange.innerText = 1;                
                } else {
                   peopleChange.innerText = 2;
                } 

              }
              


          })
        })



        //----------------------------------------------
        //            Donation Amount Valiation
        //----------------------------------------------

        const donateAmount = document.getElementById('donate');
        const minimumDonate = document.getElementById('minDonate');
        const maximumDonate = document.getElementById('maxDonate');

         donateAmount.addEventListener('change', function () {

          let checkAmount = this.value;
          
          if(checkAmount < 500){
            minimumDonate.style.display = 'block'
          } 
          else if(checkAmount >= 500 && checkAmount <=10000){
            minimumDonate.style.display = 'none'
            maximumDonate.style.display = 'none'
          }
          else if(checkAmount > 10000){
            maximumDonate.style.display = 'block'
          }

        })



        //----------------------------------------------
        //             Grand Total
        //----------------------------------------------

    
          document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const attendSpan = document.getElementById('attend');
  const donateInput = document.getElementById('donate');
  const grandTotalEl = document.getElementById('grandTotal');

  // The two checkboxes (values: "stag" and "noStag")
  const stagCheckbox = document.querySelector('.someone-check[value="stag"]');
  const plusOneCheckbox = document.querySelector('.someone-check[value="noStag"]');

  // Basic existence check
  if (!attendSpan || !donateInput || !grandTotalEl || !stagCheckbox || !plusOneCheckbox) {
    console.error('Required elements not found: attend, donate, grandTotal, or checkboxes.');
    return;
  }

  // compute number of attendees
  function getAttendeesCount() {
    const stag = stagCheckbox.checked;
    const plusOne = plusOneCheckbox.checked;

    // If +1 is checked but stag is not, assume primary also coming -> 2
    if (plusOne && !stag) return 2;
    return (stag ? 1 : 0) + (plusOne ? 1 : 0);
  }

  // price rules
  function getPassPrice(count) {
    if (count === 1) return 5000;
    if (count === 2) return 7500;
    return 0;
  }

  // calculate & update UI
  function calculateAndRender() {
    const attendees = getAttendeesCount();
    attendSpan.textContent = attendees;

    let donateAmt = Number(String(donateInput.value).replace(/[^0-9.-]/g, '')) || 0;

    if(donateAmt >10000){
      donateAmt = 10000
    }

    const passValue = getPassPrice(attendees);

    const grand = passValue + donateAmt;
    grandTotalEl.textContent = grand.toLocaleString(); // formatted number
  }

  // wire events: changes to checkboxes or donation input update totals
  stagCheckbox.addEventListener('change', calculateAndRender);
  plusOneCheckbox.addEventListener('change', calculateAndRender);
  donateInput.addEventListener('input', calculateAndRender);

  // initial render
  calculateAndRender();
});


       









        //-------------------------------------------------
        //          Popup Open Final Priciing
        //------------------------------------------------


    const openPop = document.getElementById('openPopup')

    openPop.addEventListener('click', function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("number").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const city = document.getElementById("city").value.trim();
      const adhaar = document.getElementById("adhaar").value.trim();
      const noPeople = document.getElementById("attend").textContent;
      const donateAmt = Number(document.getElementById('donate').value.trim())

      const someone = document.querySelector(".someone-check:checked")?.value || "";
      const support = document.querySelector(".support-check:checked")?.value || "";


      if( !name || !phone || !email || !address || !city || !adhaar || !someone || !support){
        alert("Please fill the form")
        e.preventDefault();
      }      
      else {

        document.getElementById('popup').style.display = 'flex';

        let donateAmt = Number(document.getElementById('donate').value.trim());

          
          if(donateAmt > 10000){
            donateAmt = 10000
          }

        
         
        let passValue;
        if(noPeople == 1){
          passValue = 5000;
        } else if(noPeople == 2){
          passValue = 7500;
        } else {
          passValue = 0
        }


        const totalValue = passValue + donateAmt;
        const taxValue = 18*totalValue/100;
        const payPrice = totalValue + taxValue;


        document.getElementById('totalPass').innerText = `₹  ${passValue}`;
        document.getElementById('totalDonate').innerText = `₹  ${donateAmt}`;
        document.getElementById('totalTax').innerText = `₹  ${taxValue}`;
        document.getElementById('totalPay').innerText = `₹ ${payPrice}`;

      }

      })
          

    document.getElementById('closePop').addEventListener('click', () => {
             document.getElementById('popup').style.display = 'none';
             location.reload();
      })






        //----------------------------------------------
        //             Create Order here
        //----------------------------------------------


    //  document.getElementById("contactForm").addEventListener("click", async function (e) {

    async function paymentRazorpay(){

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("number").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const city = document.getElementById("city").value.trim();
      const adhaar = document.getElementById("adhaar").value.trim();
      
      const noPeople = Number(document.getElementById("attend").textContent);
      let donateAmt = Number(document.getElementById('donate').value.trim());

      const someone = document.querySelector(".someone-check:checked")?.value || "";
      const support = document.querySelector(".support-check:checked")?.value || "";

          
          if(donateAmt > 10000){
            donateAmt = 10000
          }
         

      let passValue;
        if(noPeople == 1){
          passValue = 5000;
        } else if(noPeople == 2){
          passValue = 7500;
        } else {
          passValue = 0
        }

        const passDonateValue = passValue + donateAmt;
        const payValue = 18*passDonateValue/100;
        const totalPayPrice = passDonateValue + payValue;


      const formData = { name, phone, email, address, city, adhaar, noPeople, donateAmt, someone, support,passValue, donateAmt, totalPayPrice };
      console.log("FORM DATA:", formData);

          
        async function initiatePayment() {

            try {
                // 1. Call Backend to Create Order
                const response = await fetch(`${BACKEND_URL}/create-order`, 
                                              {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' }, 
                                                body: JSON.stringify({
                                                amount: totalPayPrice*100,
                                                currency: 'INR',
                                                receipt: `rcpt_${Date.now()}`,
                                                }),                     

                                              });
                const order = await response.json();

                if (!order.id) {
                    throw new Error("Order creation failed");
                }

                // 2. Configure Razorpay Options
                const options = {
                    key: KEY_ID, 
                    amount: order.amount, 
                    currency: order.currency,
                    name: "Jaipuriya",
                    description: "Reistration for Gala Re-union 21 Batch Event",
                    image: "https://cdn.iconscout.com/icon/free/png-256/razorpay-1649771-1399875.png",
                    order_id: order.id, // THE CRITICAL PART: Link frontend to backend order
                    
                    // Handler for Success
                    handler: async function (response) {
                        
                        // 3. Verify Payment on Backend
                        verifyPayment(response, formData);
                    },
                    prefill: {
                        name: formData.name,
                        contact: formData.phone,
                        email: formData.email,
                    },
                    theme: {
                        color: "#2563EB" // Blue-600 matches Tailwind
                    }
                };

                // 4. Open Checkout
                const rzp1 = new Razorpay(options);
                button.classList.remove("loading");
                
                rzp1.on('payment.failed', function (response){
                    alert("Payment Failed: " + response.error.description);
                    resetBtn();
                });

                rzp1.open();
                resetBtn(); // Reset button immediately after modal opens

            } catch (error) {
                console.error(error);
                alert("Something went wrong. Check console.");
                resetBtn();
            }
        }


         initiatePayment()

        }







      //-------------------------------------------------
      //            Verify API Calling here 
      //-------------------------------------------------


        async function verifyPayment(paymentDetails, formData) {

            try {
                const response = await fetch(`${BACKEND_URL}/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({paymentDetails, formData})
                });

                const result = await response.json();
                console.log(result)

                if (result.status === 'success') {
                    console.log("Verification successfully...")
                    localStorage.setItem('no-people', formData.noPeople)
                    localStorage.setItem('city', formData.city)
                    localStorage.setItem('phone', formData.phone)
                    localStorage.setItem('email', formData.email)
                    localStorage.setItem('name', formData.name)
                    localStorage.setItem('qr-code', result.data.qr_code )

                    window.location.href = 'success.html';

                } else {
                    console.log("Verification failed....")
                }
              } catch (error) {
                console.log('Something is error....')
             }
        }

        function resetBtn() {
            // const btn = document.getElementById('pay-btn');
            // btn.disabled = false;
            // btn.innerHTML = `<span>Registor</span>`;
        }








        // Allow only one checkbox from a group
    function allowOnlyOne(className) {
      const boxes = document.querySelectorAll("." + className);
      boxes.forEach((box) => {
        box.addEventListener("change", () => {
          if (box.checked) {
            boxes.forEach((other) => {
              if (other !== box) other.checked = false;
            });
          }
        });
      });
    }

    // allowOnlyOne("someone-check");
    allowOnlyOne("support-check");
    
    

    // Mobile Menu controls
    document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});
    

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
      const open = mobileMenu.classList.contains('open');
      if (!open) {
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
      }
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // Form submission simulation + toast
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
  


//COntact form whatsapp send

document.getElementById('contact-btn').addEventListener('click', function (e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value;
  const phone = document.getElementById('contact-phone').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-text').value;

  const whatsappNumber = '916388505758'; // with country code

  const text = `
Name: ${name}
Phone: ${phone}
email: ${email}
message: ${message}
  `;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  window.open(url, '_blank');
});





// Stop Music Logic

const music = document.getElementById('music');
const noMusic = document.getElementsByClassName('stop-music');
const audio = document.getElementById('bgMusic');

audio.volume = 0.01;

let checkMusic ;
music.addEventListener('click', () => {

  if(!checkMusic){
    noMusic[0].style.display = 'block';
    audio.pause();
    checkMusic = true;
  } else {
    noMusic[0].style.display = 'none';
    audio.play();
    checkMusic = false;
  }
});


window.addEventListener('DOMContentLoaded', () => {
  
     checkMusic = false;
  if(!checkMusic){
    noMusic[0].style.display = 'block';
    audio.pause();
    checkMusic = true;
  } else {
    noMusic[0].style.display = 'none';
    audio.play();
    checkMusic = false;
  }

});


