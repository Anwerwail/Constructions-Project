// تنفيذ بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تبديل القائمة على الأجهزة الصغيرة
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // تبديل الوضع الداكن/الفاتح
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // التحقق من التفضيل المحفوظ
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
    
    // فتح الآلة الحاسبة
    const openCalculatorBtn = document.getElementById('open-calculator');
    if (openCalculatorBtn) {
        openCalculatorBtn.addEventListener('click', function() {
            // سيتم تنفيذ هذه الوظيفة عند إضافة الآلة الحاسبة
            alert('سيتم فتح الآلة الحاسبة في الجزء التالي من الكود');
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for elements with data-scroll attribute
    const scrollLinks = document.querySelectorAll('[data-scroll]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// إضافة هذه الوظائف للجزء الخاص بالصفحات الفرعية
document.addEventListener('DOMContentLoaded', function() {
    // وظائف التبويبات
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // إزالة النشاط من جميع الأزرار والمحتويات
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // إضافة النشاط للعناصر المحددة
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // حساب مصفوفة القرار في صفحة المعايير
    const calculateBtn = document.getElementById('calculate-matrix');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const importanceInputs = document.querySelectorAll('.importance-input');
            const materials = ['الخرسانة', 'الطوب', 'الحديد', 'الخشب'];
            const scores = [0, 0, 0, 0]; // درجات كل مادة
            
            importanceInputs.forEach((input, rowIndex) => {
                const importance = parseInt(input.value) || 0;
                const rowCells = input.closest('tr').querySelectorAll('td');
                
                for (let i = 0; i < 4; i++) {
                    const materialScore = parseInt(rowCells[i + 2].textContent) || 0;
                    scores[i] += importance * materialScore;
                }
            });
            
            // العثور على أعلى درجة
            let maxScore = Math.max(...scores);
            let bestMaterialIndex = scores.indexOf(maxScore);
            
            const resultBox = document.getElementById('matrix-result');
            resultBox.innerHTML = `
                <h4>أفضل مادة بناء حسب معاييرك:</h4>
                <p><strong>${materials[bestMaterialIndex]}</strong> بدرجة ${maxScore}</p>
                <p>الدرجات الكلية: الخرسانة (${scores[0]}) | الطوب (${scores[1]}) | الحديد (${scores[2]}) | الخشب (${scores[3]})</p>
            `;
        });
    }
});

// في ملف script.js
document.addEventListener('DOMContentLoaded', function() {
    // عناصر التحكم
    const steps = document.querySelectorAll('.calculator-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const printBtn = document.querySelector('.print-btn');
    
    // تعريف الثوابت
    const MATERIAL_RATIOS = {
        concrete: {
            cement: 8,       // 8 أكياس/م³ خرسانة
            steel: 40,       // 40 كجم/م³ خرسانة
            sand: 0.5,       // 0.5 م³ رمل/م³ خرسانة
            bricks: 60       // 60 طوبة/م² جدار
        },
        steel: {
            cement: 6,
            steel: 50,
            sand: 0.4,
            bricks: 40
        }
    };

    const MATERIAL_PRICES = {
        standard: {
            cement: 850,    // دج/كيس
            steel: 95000,   // دج/طن
            sand: 3000,     // دج/م³
            bricks: 18,     // دج/طوبة
            transport: 0.2  // 20% من تكلفة المواد
        },
        premium: {
            cement: 1100,
            steel: 120000,
            sand: 3500,
            bricks: 25,
            transport: 0.2
        },
        economic: {
            cement: 750,
            steel: 85000,
            sand: 2500,
            bricks: 15,
            transport: 0.2
        }
    };

    const PROJECT_TYPES = {
        residential: 'سكني (منزل/شقة)',
        villa: 'فيلا',
        commercial: 'تجاري (محل/مكتب)',
        apartment: 'عمارة سكنية'
    };

    const STRUCTURE_TYPES = {
        concrete: 'خرساني تقليدي',
        steel: 'هيكل معدني'
    };

    const QUALITY_TYPES = {
        standard: 'قياسي',
        premium: 'فاخر',
        economic: 'اقتصادي'
    };

    // تهيئة التاريخ
    const currentDate = new Date();
    const months = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", 
                   "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    document.getElementById('current-month').textContent = 
        `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // أحداث الأزرار
    nextBtns.forEach(btn => {
        btn.addEventListener('click', goToNextStep);
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', goToPrevStep);
    });

    resetBtn.addEventListener('click', resetCalculator);
    printBtn.addEventListener('click', printResults);

    // وظائف رئيسية
    function goToStep(step) {
        steps.forEach((s, idx) => {
            s.classList.toggle('active', idx === step - 1);
        });
        
        if (step === 3) {
            calculateResults();
        }
    }

    function goToNextStep() {
        const currentStep = this.closest('.calculator-step');
        const inputs = currentStep.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateInput(input)) {
                showError(input);
                isValid = false;
            } else {
                hideError(input);
            }
        });
        
        if (isValid) {
            const currentStepNum = parseInt(currentStep.dataset.step);
            goToStep(currentStepNum + 1);
        } else {
            alert("الرجاء إكمال جميع الحقول المطلوبة بشكل صحيح");
        }
    }

    function goToPrevStep() {
        const currentStep = this.closest('.calculator-step');
        const currentStepNum = parseInt(currentStep.dataset.step);
        goToStep(currentStepNum - 1);
    }

    function resetCalculator() {
        // إعادة تعيين القيم
        document.getElementById('project-type').value = 'residential';
        document.getElementById('area').value = '';
        document.getElementById('floors').value = '1';
        document.getElementById('height').value = '2.7';
        document.getElementById('type-concrete').checked = true;
        document.getElementById('quality').value = 'standard';
        
        // إزالة رسائل الخطأ
        document.querySelectorAll('.error-msg').forEach(msg => msg.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        goToStep(1);
    }

    function printResults() {
        window.print();
    }

    // وظائف الحساب
    function calculateResults() {
        try {
            // جمع البيانات المدخلة
            const projectType = document.getElementById('project-type').value;
            const area = parseFloat(document.getElementById('area').value);
            const floors = parseFloat(document.getElementById('floors').value);
            const height = parseFloat(document.getElementById('height').value);
            const constructionType = document.querySelector('input[name="construction-type"]:checked').value;
            const quality = document.getElementById('quality').value;
            
            // حساب المساحات
            const totalArea = area * floors;
            const wallArea = calculateWallArea(totalArea, height);
            const concreteVolume = calculateConcreteVolume(totalArea);
            
            // الحصول على النسب والأسعار
            const ratios = MATERIAL_RATIOS[constructionType];
            const prices = MATERIAL_PRICES[quality];
            
            // حساب الكميات
            const cementBags = Math.ceil(concreteVolume * ratios.cement);
            const steelTons = Math.ceil((concreteVolume * ratios.steel) / 1000);
            const sandCubic = Math.ceil(concreteVolume * ratios.sand);
            const bricksCount = Math.ceil(wallArea * ratios.bricks);
            
            // حساب التكاليف
            const cementCost = cementBags * prices.cement;
            const steelCost = steelTons * prices.steel;
            const sandCost = sandCubic * prices.sand;
            const bricksCost = bricksCount * prices.bricks;
            
            const basicMaterialsCost = cementCost + steelCost + sandCost + bricksCost;
            const secondaryMaterialsCost = basicMaterialsCost * 0.4; // مواد فرعية (40%)
            const transportCost = (basicMaterialsCost + secondaryMaterialsCost) * prices.transport;
            const totalCost = basicMaterialsCost + secondaryMaterialsCost + transportCost;
            
            // عرض النتائج
            displayResults({
                projectType,
                totalArea,
                constructionType,
                quality,
                cementBags,
                steelTons,
                sandCubic,
                bricksCount,
                cementCost,
                steelCost,
                sandCost,
                bricksCost,
                basicMaterialsCost,
                secondaryMaterialsCost,
                transportCost,
                totalCost
            });
            
        } catch (error) {
            console.error("حدث خطأ في الحساب:", error);
            alert("حدث خطأ أثناء حساب النتائج. يرجى التحقق من البيانات المدخلة.");
        }
    }

    // وظائف مساعدة للحساب
    function calculateWallArea(totalArea, height) {
        // حساب مساحة الجدران بناء على ارتفاع الطابق
        return totalArea * (height / 2.7) * 3.5;
    }

    function calculateConcreteVolume(totalArea) {
        // حساب حجم الخرسانة المطلوبة
        return totalArea * 0.35;
    }

    // وظائف العرض
    function displayResults(results) {
        document.getElementById('summary-type').textContent = PROJECT_TYPES[results.projectType] || '-';
        document.getElementById('summary-area').textContent = formatNumber(results.totalArea) + ' م²';
        document.getElementById('summary-structure').textContent = STRUCTURE_TYPES[results.constructionType] || '-';
        document.getElementById('summary-quality').textContent = QUALITY_TYPES[results.quality] || '-';
        
        document.getElementById('cement-result').textContent = formatNumber(results.cementBags);
        document.getElementById('steel-result').textContent = formatNumber(results.steelTons);
        document.getElementById('sand-result').textContent = formatNumber(results.sandCubic);
        document.getElementById('bricks-result').textContent = formatNumber(results.bricksCount);
        
        document.getElementById('cement-price').textContent = formatNumber(results.cementCost);
        document.getElementById('steel-price').textContent = formatNumber(results.steelCost);
        document.getElementById('sand-price').textContent = formatNumber(results.sandCost);
        document.getElementById('bricks-price').textContent = formatNumber(results.bricksCost);
        
        document.getElementById('total-cost').textContent = formatNumber(Math.round(results.totalCost));
        document.getElementById('basic-materials-cost').textContent = formatNumber(Math.round(results.basicMaterialsCost)) + ' دج';
        document.getElementById('secondary-materials-cost').textContent = formatNumber(Math.round(results.secondaryMaterialsCost)) + ' دج';
        document.getElementById('transport-cost').textContent = formatNumber(Math.round(results.transportCost)) + ' دج';
    }

    // وظائف التحقق من الصحة
    function validateInput(input) {
        if (!input.value) return false;
        
        if (input.type === 'number') {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min) || 0;
            const max = parseFloat(input.max) || Infinity;
            
            return !isNaN(value) && value >= min && value <= max;
        }
        
        return true;
    }

    function showError(input) {
        input.classList.add('error');
        
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-msg')) {
            const errorMsg = document.createElement('p');
            errorMsg.className = 'error-msg';
            
            if (input.type === 'number') {
                const min = parseFloat(input.min);
                const max = parseFloat(input.max);
                
                if (isNaN(parseFloat(input.value))) {
                    errorMsg.textContent = 'يجب إدخال رقم صحيح';
                } else if (input.value < min) {
                    errorMsg.textContent = `القيمة يجب أن تكون ${min} أو أكثر`;
                } else if (input.value > max) {
                    errorMsg.textContent = `القيمة يجب أن تكون ${max} أو أقل`;
                } else {
                    errorMsg.textContent = 'هذا الحقل مطلوب';
                }
            } else {
                errorMsg.textContent = 'هذا الحقل مطلوب';
            }
            
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
    }

    function hideError(input) {
        input.classList.remove('error');
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-msg')) {
            errorMsg.remove();
        }
    }

    // وظائف عامة
    function formatNumber(num) {
        return num ? num.toLocaleString('ar-DZ') : '0';
    }

    // تهيئة الآلة الحاسبة
    resetCalculator();
});

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
        if (window.scrollY > lastScrollY) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Smooth scrolling for elements with data-scroll attribute
    const scrollLinks = document.querySelectorAll('[data-scroll]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});