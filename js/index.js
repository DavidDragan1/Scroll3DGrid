// Import the necessary function for preloading images
import { preloadImages, getGrid } from './utils.js';

// Define a variable that will store the Lenis smooth scrolling object
let lenis;

// Function to initialize Lenis for smooth scrolling
const initSmoothScrolling = () => {
	// Instantiate the Lenis object with specified properties
	lenis = new Lenis({
		lerp: 0.1, // Lower values create a smoother scroll effect
		smoothWheel: true // Enables smooth scrolling for mouse wheel events
	});

	// Update ScrollTrigger each time the user scrolls
	lenis.on('scroll', () => ScrollTrigger.update());

	// Define a function to run at each animation frame
	const scrollFn = (time) => {
		lenis.raf(time); // Run Lenis' requestAnimationFrame method
		requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
	};
	// Start the animation frame loop
	requestAnimationFrame(scrollFn);
};

// All elements with class .grid
const grids = document.querySelectorAll('.grid');

// Function to apply scroll-triggered animations to a given gallery
const applyAnimation = (grid, animationType) => {
	// Child elements of grid
	const gridWrap = grid.querySelector('.grid-wrap');
	const gridItems = grid.querySelectorAll('.grid__item');
	const gridItemsInner = [...gridItems].map(item => item.querySelector('.grid__item-inner'));
	
	// Define GSAP timeline with ScrollTrigger
	const timeline = gsap.timeline({
	  	defaults: { ease: 'none' },
	  	scrollTrigger: {
			trigger: gridWrap,
			start: 'top bottom+=5%',
			end: 'bottom top-=5%',
			scrub: true
	  	}
	});
	
	// Apply different animations based on type
	switch(animationType) {

		case 'type5':

			// Set some CSS related style values
			grid.style.setProperty('--perspective', '2500px');
			grid.style.setProperty('--grid-width', '250%');
			grid.style.setProperty('--grid-columns', '15');
			grid.style.setProperty('--grid-gap', '0.2');
			
			
			const gridObj = getGrid(gridItems);

			timeline
			.set(gridWrap, {rotationX: 65, rotationY: 320, rotationZ: 15})
			
			.to(gridObj.rows('even'), {
				xPercent: -200,
				ease: 'power1'
			}, 0)
			.to(gridObj.rows('odd'), {
				xPercent: 200,
				ease: 'power1'
			}, 0)
			.addLabel('rowsEnd', '>-=0.15')
			

			break;
	  	
		default:
			console.error('Unknown animation type.');
			break;
	}
}

// Apply animations to each grid
const scroll = () => {
	grids.forEach((grid, i) => {
		// Determine animation type
		let animationType;
		switch (i % 6) {
			case 0:
				animationType = 'type5';
				break;

		}
		applyAnimation(grid, animationType);
	});
}

// Preload images, initialize smooth scrolling, apply scroll-triggered animations, and remove loading class from body
preloadImages('.grid__item-inner').then(() => {
	initSmoothScrolling();
	scroll();
	document.body.classList.remove('loading');
});