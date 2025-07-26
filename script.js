document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Portfolio Filter Functionality
    const categoryFilters = document.querySelectorAll('.category-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filterDropdownBtn = document.getElementById('filterDropdownBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    let dropdownIcon = null;

    if (filterDropdownBtn) {
        dropdownIcon = filterDropdownBtn.querySelector('i');
    }

    // Function to filter portfolio items by category
    function filterPortfolio(category) {
        // Remove active class from all filters
        categoryFilters.forEach(btn => {
            btn.classList.remove('active', 'bg-primary-500/20');
            const span = btn.querySelector('span');
            if (span) span.classList.add('gradient-text');
        });

        // Add active class to the filter button for the selected category
        const activeFilter = document.querySelector(`.category-filter[data-category="${category}"]`);
        if (activeFilter) {
            activeFilter.classList.add('active', 'bg-primary-500/20');
            const span = activeFilter.querySelector('span');
            if (span) span.classList.add('gradient-text');
        }

        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            // Hide all items initially
            item.classList.add('hidden');
            item.classList.remove('animate-fade-in-up');

            // Show items that match the selected category
            if (itemCategory === category) {
                item.classList.remove('hidden');
                item.classList.add('animate-fade-in-up');
            }
        });

        // Limit to 3 items for the selected category
        const visibleItems = Array.from(portfolioItems)
            .filter(item => !item.classList.contains('hidden') && item.getAttribute('data-category') === category)
            .slice(0, 3);
        
        portfolioItems.forEach(item => {
            if (!visibleItems.includes(item)) {
                item.classList.add('hidden');
                item.classList.remove('animate-fade-in-up');
            }
        });

        // Update dropdown button text on mobile
        if (filterDropdownBtn && activeFilter) {
            const selectedText = activeFilter.textContent.trim();
            const span = filterDropdownBtn.querySelector('span');
            if (span) span.textContent = selectedText;
            
            // Close dropdown
            if (filterDropdown) {
                filterDropdown.classList.add('hidden');
            }
            if (dropdownIcon) {
                dropdownIcon.classList.remove('fa-chevron-up');
                dropdownIcon.classList.add('fa-chevron-down');
            }
        }
    }

    // Add click event listeners to filter buttons
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.getAttribute('data-category');
            filterPortfolio(category);
        });
    });

    // Dropdown Toggle for Mobile
    if (filterDropdownBtn && filterDropdown && dropdownIcon) {
        filterDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterDropdown.classList.toggle('hidden');
            dropdownIcon.classList.toggle('fa-chevron-down');
            dropdownIcon.classList.toggle('fa-chevron-up');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (filterDropdown && dropdownIcon) {
            filterDropdown.classList.add('hidden');
            dropdownIcon.classList.remove('fa-chevron-up');
            dropdownIcon.classList.add('fa-chevron-down');
        }
    });

    // Prevent dropdown from closing when clicking inside it
    if (filterDropdown) {
        filterDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Set default filter to 'business' on page load
    filterPortfolio('business');

    // Go to Top Button
    const goToTopBtn = document.getElementById('goToTopBtn');
    if (goToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                goToTopBtn.style.display = 'block';
                goToTopBtn.style.opacity = '1';
                goToTopBtn.style.transform = 'translateY(0)';
            } else {
                goToTopBtn.style.opacity = '0';
                goToTopBtn.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    goToTopBtn.style.display = 'none';
                }, 300);
            }
        });

        goToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Improved Lazy Load Iframes with error handling
    const iframes = document.querySelectorAll('iframe[data-src]');
    if (iframes.length > 0) {
        const iframeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    
                    // Check if the iframe already has a src (to prevent double loading)
                    if (!iframe.src) {
                        // Create a temporary div to check if the URL can be iframed
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = `<iframe src="${iframe.dataset.src}" style="display:none"></iframe>`;
                        document.body.appendChild(tempDiv);
                        
                        // Check if the iframe loaded successfully
                        tempDiv.querySelector('iframe').onload = function() {
                            iframe.src = iframe.dataset.src;
                            document.body.removeChild(tempDiv);
                            observer.unobserve(iframe);
                        };
                        
                        tempDiv.querySelector('iframe').onerror = function() {
                            // If iframe fails to load, show a fallback message
                            const container = iframe.closest('.portfolio-item');
                            if (container) {
                                container.innerHTML = `
                                    <div class="aspect-video bg-gray-800 rounded-t-2xl flex items-center justify-center">
                                        <div class="text-center p-6">
                                            <i class="fas fa-exclamation-triangle text-yellow-400 text-3xl mb-3"></i>
                                            <p class="text-gray-300 mb-2">Live preview not available</p>
                                            <a href="${iframe.dataset.src}" 
                                               target="_blank" 
                                               class="text-primary-400 hover:underline">
                                                Visit website directly
                                            </a>
                                        </div>
                                    </div>
                                    <div class="p-6">
                                        <div class="flex items-center justify-between">
                                            <div class="flex space-x-2">
                                                <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
                                                <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
                                                <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
                                            </div>
                                            <a href="${iframe.dataset.src}" target="_blank"
                                                class="text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                View Project →
                                            </a>
                                        </div>
                                    </div>
                                `;
                            }
                            document.body.removeChild(tempDiv);
                            observer.unobserve(iframe);
                        };
                    }
                }
            });
        }, {rootMargin: '200px'}); // Start loading when 200px away from viewport

        iframes.forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }

    // Contact Form Submission with WhatsApp integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Format WhatsApp message
const whatsappMessage = `Hi ABM IT Support,\n\nI'm interested in your *${service}* services.\n\n*Name:* ${name}\n*Phone:* ${phone}\n\n*Project Details:*\n${message}\n\nPlease contact me to discuss further.`;            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Open WhatsApp with pre-filled message
            window.open(`https://wa.me/918248794519?text=${encodedMessage}`, '_blank');
            
            // Optional: Reset form after submission
            contactForm.reset();
        });
    }
});