<template>
  <div>
   <h1>Welcome to the Product List Page</h1> 
   <div class="row  align-items-center">
            <div v-for="lesson in displayLessons" :key="lesson.id" class="col-lg-2 col-md-4 mt-1 ">
                <div class="card bg-light woop  ">

                    <img width="200" height="200" v-bind:src="lesson.image" class="card-img-top"> 

                   <div class="card-body text-center">
                        
                    <h2 class="mb-5 card-title">{{lesson.subject}}</h2>

                        <p class="card-text"><i class="fa-solid fa-location-dot"></i> Location: {{lesson.location}}</p>
                        <p class="card-text">Price: <i class="fa-solid fa-sterling-sign"></i> {{lesson.price}}</p>
                        <p class="card-text">Spaces Available: {{lesson.available}}</p>
                        <div>
                        <!-- Render filled stars (★) -->
                        <span v-for="filledStar in Math.round(lesson.rating)" :key="'filled-' + filledStar"><font-awesome-icon icon="fa-solid fa-star" /></span>
                         <!-- Render half-filled star (★) if applicable -->
                        <span v-if="lesson.rating % 1 !== 0">
                            <font-awesome-icon icon="star-half-stroke" />
                        </span>
                        <!-- Render empty stars (☆) -->
                        <span v-for="emptyStar in 5 - Math.round(lesson.rating)" :key="'empty-' + emptyStar"><font-awesome-icon icon="star" style="color: #a29eae;" /></span>
                        </div>

                        <button class="btn rounded-5 text-light btn-dark" v-on:click="addToCart(lesson)" v-if="lesson.available != 0"> add course <font-awesome-icon icon="plus" /> </button>

                        <button class="btn rounded-5 text-dark btn-light" disabled="addToCart" v-else> 
                        Out Of Stock <font-awesome-icon icon="hourglass" /></button>
                        
                    </div>
                </div>
            </div>
        </div>
</div>
 </template>

<script>
export default {
  name: "ProductList",
  props: {
    displayLessons: {
      type: Array,
      required: true
    },
    carts: {
      type: Array,
      required: true
    },
    addToCart: {
      type: Function,
      required: true
    }
  }
};
</script>