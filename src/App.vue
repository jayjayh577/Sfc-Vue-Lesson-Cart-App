<script>
import ProductList from './components/ProductList.vue'
import Checkout from './components/Checkout.vue'

export default {
 name: "App",
 data() { return { 
  testConsole: false,
      showTestConsole: false,
      sitename: "LessonStore",
      checkoutinfo: "Check Out Info",
      show: true,
      defaultSort: "null",
      sortDirection: "asc", 
      searchQuery:"", 
      lessons: [],
      checkoutInfo: {
        Name: "",
        Number: "",
      },
      NameValid: "",
      NumberValid: "",
      isLoading: false,
      carts: [],
      searchCriteria: 'subject',
      serverURL: "https://aws-fetch-server.onrender.com/collections/Products",
      currentView: ProductList,
     } },

 components: { ProductList, Checkout },

 methods: {  
  fetchDataFromAPI: function() {
      this.isLoading = true;

      fetch('https://aws-fetch-server.onrender.com/collections/Products')
        .then(response => response.json())
        .then(data => {
          this.lessons = data;
        })
        .catch(error => {
          console.error('Error fetching data from API:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    addToCart: function (lesson) {
      if (this.canAddToCart(lesson)) {
        if (lesson.AddedTOCart > 0) {
          lesson.AddedTOCart++;
        } else {
          lesson.AddedTOCart++;
          if (!lesson._id) {
            console.error('Lesson ID is missing. Please check your lesson object.');
            return;
          }
          this.carts.push(lesson);
        }
    
        // Update the lesson availability locally
        if (lesson.available > 0) {
          lesson.available --;
        }
    
        console.log(this.carts);
      }
    },
    
    updateLessonAvailability: function (lessonId, available) {
      const updateData = {
        available: available,
      };
    
      fetch(`https://aws-fetch-server.onrender.com/collections/Products/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((updatedLesson) => {
          console.log('Lesson updated successfully on the server:', updatedLesson);
        })
        .catch((error) => {
          console.error('Error updating lesson availability:', error);
        });
    },
    canAddToCart: function(lesson){
          return lesson.available > 0;
      },
    removeFromCart(lesson) {

        const index = this.carts.indexOf(lesson);

        if (index !== -1) {
          if (lesson.AddedTOCart > 1) {
            // Decrease the AddedTOCart count
            lesson.AddedTOCart--;
          } else {
            // Remove the lesson from the cart if AddedTOCart is 1
            lesson.AddedTOCart--;
            this.carts.splice(index, 1);
          }
            lesson.available++;

            console.log(this.carts);
            // lesson.AddedTOCart--;
        }
    },
    checkout() {
        // Check if there are items in the cart
        if (this.carts.length === 0) {
          alert('Your cart is empty. Add items before checking out.');
          return;
        }
      
        // Create an array to store the items in the cart
        const cartItems = this.carts.map((item) => {
          return {
            lesson_id: item._id,  
            addedToCart: item.AddedTOCart,
            removedfromcart: item.available,
          };
        });
      
                  
        // Update lesson availability on the server for each lesson in the cart
        cartItems.forEach((cartItem) => {
          this.updateLessonAvailability(cartItem.lesson_id, cartItem.removedfromcart);
        });

        const postData = {
          name: this.NameValid,
          phoneNumber: this.NumberValid,
          cartItems: cartItems,
        };
      
        // Send a POST request to the server
        fetch('https://aws-fetch-server.onrender.com/collections/Order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((json) => {
            alert(`Congratulations ${this.NameValid}! Your order has been placed.`);
            console.log('Success:', json);
            
            // Clear the cart after successful checkout
            this.carts = [];
          })
          .catch((error) => {
            console.error('Error during checkout:', error);
          });
     },

   showCheckout() {
      if (this.currentView === ProductList) {
        this.currentView = Checkout;
      } else {
        this.currentView = ProductList;
      }
    },

    toggleTestConsole() {
      this.testConsole = !this.testConsole;
      this.showTestConsole = !this.showTestConsole;
    },

    deleteAllCaches() {
        caches.keys().then(function(names) {
         for (let name of names)
        caches.delete(name);
         });
         console.log("All Caches Deleted");
         },

     unregisterAllServiceWorkers() {
       navigator.serviceWorker.getRegistrations().then(function (registrations) {
           for (let registration of registrations) {
          registration.unregister()
           }
       });
           console.log("ServiceWorkers Unregistered");
       },
          
      reloadPage() {
         window.location.reload();
          },

  },
  computed: { 
    ItemsInCart: function () {
          return this.carts.length;
      },

    displayLessons() {
        // Sort all lessons
        const sortOrder = this.sortDirection === "asc" ? 1 : -1;
        return this.lessons.slice().sort((a, b) => {
          if (this.defaultSort === "subject") {
            return sortOrder * a.subject.localeCompare(b.subject);
          } else if (this.defaultSort === "location") {
            return sortOrder * a.location.localeCompare(b.location);
          } else if (this.defaultSort === "price") {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return sortOrder * (priceA - priceB);
          } else if (this.defaultSort === "available") {
            return sortOrder * (a.available - b.available);
          }
        });
      },
      async searchLessons() {
        try {
          // Check if the search query is empty
          if (!this.searchQuery.trim()) {
            // If the search query is empty, reset the lessons to the original data
            this.fetchDataFromAPI();
            return;
          }
      
          // Construct the URL with the query parameter
          const url = `https://aws-fetch-server.onrender.com/collections/Products/search?q=${this.searchQuery}`;
      
          // Make the fetch request
          const response = await fetch(url);
      
          // Check if the request was successful
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
      
          // Parse the JSON response
          const data = await response.json();
      
          // Update the lessons with the search results
          this.lessons = data;
      
          // Check if search returned no results
          if (this.lessons.length === 0) {
            console.log('No results found.');
            // You can provide a message to the user indicating no results were found
          }
        } catch (error) {
          console.error('Error during search:', error);
          // Handle errors as needed
        }
      },          
      sortedCarts() {
          return this.carts.slice().sort((a, b) => {
            // Compare lessons based on the selected criteria
            const sortOrder = this.sortDirection === "asc" ? 1 : -1;

            if (this.defaultSort === "subject") {
              return sortOrder * a.subject.localeCompare(b.subject);
            } else if (this.defaultSort === "location") {
              return sortOrder *  a.location.localeCompare(b.location);
            } else if (this.defaultSort === "price") {
              const priceA = parseFloat(a.price.replace('$', ''));
              const priceB = parseFloat(b.price.replace('$', ''));
              return sortOrder * (priceA - priceB);
            } else if (this.defaultSort === "available") {
              return sortOrder *  a.available - b.available;
            }
          });
        },
        isNameandNumberValid() {
          const namePattern = /^[a-zA-Z ]+$/;
          const phoneNumberTest =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
          return (
            namePattern.test(this.NameValid) &&
            phoneNumberTest.test(this.NumberValid)
          );
        }
  },
  created: function () {
  let webstore = this;
  fetch(this.serverURL)
    .then(function (response) {
      response.json()
        .then(function (json) {
          webstore.lessons = json;
        });
    });
  
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("Sfc-Vue-Lesson-Cart-App/service-worker.js");
  }
},

}

</script>

<template>
  <div id="app">
    <main>
      <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand">
          <h1 v-text="sitename"></h1>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <button class="nav-link btn btn-dark" @click="showCheckout">
                {{ItemsInCart}}
               <font-awesome-icon icon="fa-solid fa-cart-shopping" />
                Cart
              </button>
            </li>
          </ul>
      
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <h3 class="nav-link">Items in Cart: {{ ItemsInCart }}</h3>
            </li>
          </ul>
      
          <div class="d-flex align-items-center">
            <select class="form-select me-2" id="sortSelect" v-model="defaultSort">
              <option value="null">Click to sort</option>
              <option value="subject">Subject</option>
              <option value="location">Location</option>
              <option value="price">Price</option>
              <option value="available">Available</option>
            </select>
      
            <select class="form-select me-2" id="sortDirection" v-model="sortDirection">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
      
            <input
              type="text"
              class="form-control me-2"
              id="searchInput"
              v-model="searchQuery"
              @input="searchLessons"
              placeholder="Search"
            />
          </div>
          <hr>
          <button style="background-color: white; color: black;" @click="toggleTestConsole" class="btn btn-light me-2">
            <font-awesome-icon :icon="['fas', 'text-height']" />
            Test Console
          </button>
          <span v-if="testConsole && showTestConsole">
          <button style="background-color: white; color: black;" @click="deleteAllCaches" class="btn btn-light me-2">
            <font-awesome-icon icon="trash" />
            Delete All Caches
          </button>
      
          <button @click="reloadPage" class="btn btn-light me-2">
            <font-awesome-icon icon="rotate" />
            Reload Page
          </button>
      
          <strong class="me-2 text-light">HTTPS Test: </strong>
          <a v-bind:href="serverURL" target="_blank" class="btn btn-light me-2">
            <font-awesome-icon icon="link" /> link</a>
      
          <button @click="unregisterAllServiceWorkers" class="btn btn-light">
            <font-awesome-icon icon="fab fa-uniregistry" />
            Unregister All ServiceWorkers
          </button>
        </span>
        </div>
      </nav>
    </header>
    <component :is="currentView" 
                 :displayLessons="displayLessons" 
                 :carts="carts" 
                 :addToCart="addToCart" 
                 :sortedCarts="sortedCarts" 
                 :removeFromCart="removeFromCart"
                 :NameValid="NameValid"
                 :NumberValid="NumberValid"
                 :checkoutinfo="checkoutinfo"
                 :checkout="checkout"
                 :isNameandNumberValid="isNameandNumberValid">
      </component>
    </main>
  </div>
</template>

