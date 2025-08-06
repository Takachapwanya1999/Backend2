import React from 'react';
import Layout from '../components/ui/Layout';

const ServicesPage = () => {
  // Real Airbnb services
  const airbnbServices = [
    {
      id: 'hosting',
      title: 'Airbnb your home',
      description: 'Earn money by hosting travelers from around the world',
      image: '/assets/hero.png',
      benefits: ['Earn extra income', 'Meet people from around the world', 'Share your space on your terms'],
      cta: 'Start hosting',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    {
      id: 'experiences',
      title: 'Host an experience',
      description: 'Share your passion and interests with travelers through unique activities',
      image: '/assets/hero.png',
      benefits: ['Share your expertise', 'Create meaningful connections', 'Build your own business'],
      cta: 'Host an experience',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 'frontdesk',
      title: 'Airbnb-friendly apartments',
      description: 'Discover apartments in buildings that welcome Airbnb hosting',
      image: '/assets/hero.png',
      benefits: ['No hosting restrictions', 'Purpose-built for short stays', 'Full property management'],
      cta: 'Learn more',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,11H16V10A4,4 0 0,0 12,6A4,4 0 0,0 8,10V11H7A2,2 0 0,0 5,13V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V13A2,2 0 0,0 17,11M12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17M14,11H10V10A2,2 0 0,1 12,8A2,2 0 0,1 14,10V11Z"/>
        </svg>
      )
    }
  ];

  // Host resources
  const hostResources = [
    {
      title: 'Host protection',
      description: 'Comprehensive coverage for hosts',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
        </svg>
      )
    },
    {
      title: '24/7 support',
      description: 'Get help whenever you need it',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1C18.08,1 23,5.92 23,12C23,18.08 18.08,23 12,23C5.92,23 1,18.08 1,12C1,5.92 5.92,1 12,1M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
        </svg>
      )
    },
    {
      title: 'Host guarantee',
      description: 'Protection for your property',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
        </svg>
      )
    },
    {
      title: 'Tools and insights',
      description: 'Optimize your listing with data',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
        </svg>
      )
    },
    {
      title: 'Professional photos',
      description: 'High-quality listing photography',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
        </svg>
      )
    },
    {
      title: 'Smart pricing',
      description: 'Automatic price optimization',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
        </svg>
      )
    }
  ];

  // Success stories
  const successStories = [
    {
      name: 'Sarah',
      location: 'Cape Town, South Africa',
      story: 'Hosting helped me pay off my student loans and meet amazing people from around the world.',
      earnings: 'R15,000 per month',
      image: '/assets/hero.png'
    },
    {
      name: 'David',
      location: 'Johannesburg, South Africa',
      story: 'I started hosting my photography workshop and now it\'s become my full-time business.',
      earnings: 'R8,500 per experience',
      image: '/assets/hero.png'
    },
    {
      name: 'Nomsa',
      location: 'Durban, South Africa',
      story: 'Teaching traditional cooking has connected me with my heritage and travelers who love to learn.',
      earnings: 'R5,200 per class',
      image: '/assets/hero.png'
    },
    {
      name: 'Michael',
      location: 'Stellenbosch, South Africa',
      story: 'My wine farm has become a destination for travelers seeking authentic experiences.',
      earnings: 'R12,800 per month',
      image: '/assets/hero.png'
    },
    {
      name: 'Lerato',
      location: 'Pretoria, South Africa',
      story: 'Hosting art workshops in my studio has allowed me to share my passion while earning income.',
      earnings: 'R6,700 per workshop',
      image: '/assets/hero.png'
    },
    {
      name: 'Johan',
      location: 'Port Elizabeth, South Africa',
      story: 'My beachfront property became popular with surfers and beach lovers from everywhere.',
      earnings: 'R18,500 per month',
      image: '/assets/hero.png'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Try hosting on Airbnb
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Earn money sharing your space, passion, or skills with millions of travelers around the world.
          </p>
          <button className="bg-red-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors">
            Get started
          </button>
        </div>

        {/* Main Services */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Choose how you want to host</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {airbnbServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-full p-3 text-red-500">
                    {service.icon}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-8">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                    {service.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Host Resources */}
        <section className="mb-20 bg-gray-50 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support along the way</h2>
            <p className="text-lg text-gray-600">
              We're here to help you succeed with tools, resources, and support every step of the way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {hostResources.map((resource, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stories from hosts</h2>
            <p className="text-lg text-gray-600">
              See how hosting has transformed lives and communities around South Africa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{story.story}"</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-semibold">Earns {story.earnings}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to get started */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to get started</h2>
            <p className="text-lg text-gray-600">
              It's easy to become a host. Follow these simple steps to start earning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tell us about your space</h3>
              <p className="text-gray-600">
                Share some basic info, like where it is and how many guests can stay.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Make it stand out</h3>
              <p className="text-gray-600">
                Add photos, a description, and set your price. We'll help you along the way.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Finish and publish</h3>
              <p className="text-gray-600">
                Choose a starting date, set your calendar, and publish your listing.
              </p>
            </div>
          </div>
        </section>

        {/* Earning Calculator */}
        <section className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Estimate your earnings</h2>
          <p className="text-lg mb-8 opacity-90">
            See how much you could earn by hosting your space on Airbnb.
          </p>
          
          <div className="max-w-md mx-auto bg-white rounded-lg p-6 text-gray-900">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                placeholder="Enter your location"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg">
                <option>Entire place</option>
                <option>Private room</option>
                <option>Shared room</option>
              </select>
            </div>
            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
              Calculate earnings
            </button>
          </div>
          
          <div className="mt-8 text-2xl font-bold">
            You could earn up to <span className="text-yellow-300">R12,000</span> per month
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ServicesPage;
