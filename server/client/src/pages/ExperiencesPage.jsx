import React from 'react';
import Layout from '../components/ui/Layout';
import ClickableImage from '../components/ui/ClickableImage';

const ExperiencesPage = () => {
  // Real Airbnb experience categories
  const experienceCategories = [
    {
      id: 'arts-culture',
      title: 'Arts & Culture',
      image: '/assets/hero.png',
      count: '1,000+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      image: '/assets/hero.png',
      count: '500+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      id: 'food-drink',
      title: 'Food & Drink',
      image: '/assets/hero.png',
      count: '1,500+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
        </svg>
      )
    },
    {
      id: 'sports',
      title: 'Sports',
      image: '/assets/hero.png',
      count: '800+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.89 19.38l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L9 5.5c-.6 0-1.1.4-1.3 1L6.5 10.5c-.3.8 0 1.7.8 2l1.5.5 1.5 5.5 1.5-.2z"/>
        </svg>
      )
    },
    {
      id: 'tours',
      title: 'Tours',
      image: '/assets/hero.png',
      count: '2,000+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 'wellness',
      title: 'Wellness',
      image: '/assets/hero.png',
      count: '600+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.8 17.3l-4.2-4.1L4 14.8l5.8 5.7L22 8.3l-1.6-1.6L9.8 17.3z"/>
        </svg>
      )
    },
    {
      id: 'nature',
      title: 'Nature & Outdoors',
      image: '/assets/hero.png',
      count: '900+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,6l-4.22,5.63L7.25,8.75L5,12l4.25,6h9.5L14,6z M8.5,12.5l2.5,3.5L14.5,12L12,8L8.5,12.5z"/>
        </svg>
      )
    },
    {
      id: 'history',
      title: 'History & Culture',
      image: '/assets/hero.png',
      count: '750+ experiences',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
    }
  ];

  // Featured experiences with South African locations
  const featuredExperiences = [
    {
      id: 1,
      title: 'Wine Tasting in Stellenbosch',
      host: 'Hosted by Sarah',
      image: '/assets/hero.png',
      price: 'From R450',
      rating: 4.9,
      reviews: 127,
      duration: '3 hours',
      description: 'Discover the best wines of the Cape Winelands with a local sommelier.'
    },
    {
      id: 2,
      title: 'Table Mountain Hiking Experience',
      host: 'Hosted by David',
      image: '/assets/hero.png',
      price: 'From R350',
      rating: 4.8,
      reviews: 89,
      duration: '4 hours',
      description: 'Hike up Table Mountain with stunning views of Cape Town and the ocean.'
    },
    {
      id: 3,
      title: 'Traditional South African Cooking',
      host: 'Hosted by Nomsa',
      image: '/assets/hero.png',
      price: 'From R280',
      rating: 4.9,
      reviews: 156,
      duration: '2.5 hours',
      description: 'Learn to cook authentic South African dishes like bobotie and vetkoek.'
    },
    {
      id: 4,
      title: 'Safari Photography Workshop',
      host: 'Hosted by Michael',
      image: '/assets/hero.png',
      price: 'From R650',
      rating: 4.7,
      reviews: 73,
      duration: '6 hours',
      description: 'Capture the Big Five with professional photography techniques.'
    },
    {
      id: 5,
      title: 'Cape Town Township Tour',
      host: 'Hosted by Thabo',
      image: '/assets/hero.png',
      price: 'From R320',
      rating: 4.8,
      reviews: 94,
      duration: '3.5 hours',
      description: 'Experience the vibrant culture and history of Cape Town townships.'
    },
    {
      id: 6,
      title: 'Shark Cage Diving',
      host: 'Hosted by John',
      image: '/assets/hero.png',
      price: 'From R1,200',
      rating: 4.9,
      reviews: 201,
      duration: '8 hours',
      description: 'Get up close with great white sharks in Gansbaai.'
    },
    {
      id: 7,
      title: 'Penguin Colony Visit',
      host: 'Hosted by Lisa',
      image: '/assets/hero.png',
      price: 'From R180',
      rating: 4.6,
      reviews: 67,
      duration: '2 hours',
      description: 'Meet the adorable African penguins at Boulders Beach.'
    },
    {
      id: 8,
      title: 'Drakensberg Mountains Trek',
      host: 'Hosted by Peter',
      image: '/assets/hero.png',
      price: 'From R500',
      rating: 4.7,
      reviews: 112,
      duration: '6 hours',
      description: 'Explore the majestic Drakensberg Mountains with breathtaking views.'
    }
  ];

  // Online experiences
  const onlineExperiences = [
    {
      id: 1,
      title: 'Virtual South African Culture Tour',
      host: 'Hosted by Thabo',
      image: '/assets/hero.png',
      price: 'From R85',
      rating: 4.8,
      reviews: 234,
      duration: '1 hour',
      description: 'Explore South African culture, music, and traditions from home.'
    },
    {
      id: 2,
      title: 'Online Braai Masterclass',
      host: 'Hosted by Johan',
      image: '/assets/hero.png',
      price: 'From R120',
      rating: 4.9,
      reviews: 167,
      duration: '1.5 hours',
      description: 'Master the art of South African braai from your own kitchen.'
    },
    {
      id: 3,
      title: 'Virtual Wine Tasting Experience',
      host: 'Hosted by Maria',
      image: '/assets/hero.png',
      price: 'From R150',
      rating: 4.7,
      reviews: 89,
      duration: '1.5 hours',
      description: 'Taste South African wines with a sommelier guide from home.'
    },
    {
      id: 4,
      title: 'Online African Art Workshop',
      host: 'Hosted by Zara',
      image: '/assets/hero.png',
      price: 'From R95',
      rating: 4.8,
      reviews: 112,
      duration: '2 hours',
      description: 'Create beautiful African-inspired artwork with local artists.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Banner - Airbnb Experiences Style */}
      <div className="relative">
        <div className="h-[70vh] flex items-center justify-center relative overflow-hidden">
          <ClickableImage
            src="/assets/hero.png"
            alt="Unforgettable activities hosted by locals"
            title="Unforgettable activities hosted by locals"
            className="absolute inset-0 w-full h-full object-cover"
            containerClassName="absolute inset-0"
            showClickHint={false}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </ClickableImage>
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Unforgettable activities hosted by locals</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Find and book unique experiences on Airbnb—from cooking classes to guided tours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Explore experiences
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
                </svg>
                Try online experiences
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating search bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-3xl px-6 z-20">
          <div className="bg-white rounded-full shadow-2xl p-2">
            <div className="flex items-center">
              <div className="flex-1 px-4">
                <input
                  type="text"
                  placeholder="Try 'wine tasting'"
                  className="w-full py-3 text-lg border-none outline-none"
                />
              </div>
              <button className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing for floating search bar */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Experience Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Browse experiences by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {experienceCategories.map((category) => (
              <div key={category.id} className="cursor-pointer group text-center">
                <div className="rounded-xl overflow-hidden mb-3 relative">
                  <ClickableImage
                    src={category.image} 
                    alt={category.title}
                    title={`${category.title} - ${category.count}`}
                    className="w-full h-40 object-cover"
                    containerClassName="rounded-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <div className="absolute top-3 left-3 text-white">
                      {category.icon}
                    </div>
                  </ClickableImage>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.title}</h3>
                <p className="text-xs text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Experiences */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Featured experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExperiences.map((experience) => (
              <div key={experience.id} className="cursor-pointer group">
                <div className="rounded-xl overflow-hidden mb-3 relative">
                  <ClickableImage
                    src={experience.image} 
                    alt={experience.title}
                    title={`${experience.title} - ${experience.description}`}
                    className="w-full h-64 object-cover"
                    containerClassName="rounded-xl overflow-hidden"
                  >
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {experience.duration}
                    </div>
                  </ClickableImage>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{experience.host}</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({experience.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{experience.description}</p>
                  <p className="font-semibold text-gray-900">{experience.price} per person</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Online Experiences */}
        <section className="mb-20 bg-gray-50 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Airbnb Online Experiences</h2>
            <p className="text-lg text-gray-600">
              Interactive activities you can do together, led by expert hosts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {onlineExperiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group">
                <div className="relative">
                  <ClickableImage
                    src={experience.image} 
                    alt={experience.title}
                    title={`${experience.title} - ${experience.description}`}
                    className="w-full h-48 object-cover"
                    containerClassName=""
                    showClickHint={false}
                  >
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ONLINE
                    </div>
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {experience.duration}
                    </div>
                  </ClickableImage>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{experience.host}</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({experience.reviews})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{experience.title}</h3>
                  <p className="text-gray-600">{experience.description}</p>
                  <p className="font-semibold text-gray-900 text-lg">{experience.price} per person</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Airbnb Experiences work</h2>
            <p className="text-lg text-gray-600">
              Every experience is designed to be interactive, inclusive, and led by expert hosts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Find the perfect experience</h3>
              <p className="text-gray-600">
                Browse thousands of unique activities led by local experts in over 1,000 cities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Book with confidence</h3>
              <p className="text-gray-600">
                Read reviews from other travelers and book your spot with just a few clicks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Make memories</h3>
              <p className="text-gray-600">
                Join your host and fellow travelers for an unforgettable experience.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for an adventure?</h2>
          <p className="text-lg mb-8 opacity-90">
            Discover unique experiences happening near you or around the world.
          </p>
          <button className="bg-white text-red-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Explore experiences
          </button>
        </section>
      </div>
      </div>
    </Layout>
  );
};

export default ExperiencesPage;
