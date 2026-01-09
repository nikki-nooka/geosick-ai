export const supportedLanguages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'हिन्दी' },
    { code: 'bn-IN', name: 'বাংলা' },
    { code: 'te-IN', name: 'తెలుగు' },
    { code: 'mr-IN', name: 'मరాਠੀ' },
    { code: 'ta-IN', name: 'தமிழ்' },
    { code: 'ur-IN', name: 'اردو' },
    { code: 'gu-IN', name: 'గుજરાતી' },
    { code: 'kn-IN', name: 'కన్నడ' },
    { code: 'or-IN', name: 'ଓଡ଼ିଆ' },
    { code: 'ml-IN', name: 'മലയാളం' },
    { code: 'pa-IN', name: 'ਪੰਜਾਬੀ' },
    { code: 'as-IN', name: 'অসমীয়া' },
    { code: 'mai-IN', name: 'मैथिली' },
    { code: 'sat-IN', name: 'ᱥᱟᱱᱛᱟᱲᱤ' },
];

type TranslationDict = {
    [langCode: string]: string;
};

type Translations = {
    [key: string]: TranslationDict;
};

export const translations: Translations = {
    // Global & Sidebar
    'dashboard': { 'en-US': 'Dashboard', 'hi-IN': 'डैशबोर्ड', 'te-IN': 'డాష్‌బోర్డ్' },
    'activity_history': { 'en-US': 'Activity History', 'hi-IN': 'गतिविधि इतिहास', 'te-IN': 'కార్యాచరణ చరిత్ర' },
    'my_profile': { 'en-US': 'My Profile', 'hi-IN': 'मेरी प्रोफाइल', 'te-IN': 'నా ప్రొఫైల్' },
    'admin_dashboard': { 'en-US': 'Admin Dashboard', 'hi-IN': 'एडमिन डैशबोर्ड', 'te-IN': 'అడ్మిన్ డాష్‌బోర్డ్' },
    'feedback_review': { 'en-US': 'Feedback & Review', 'hi-IN': 'प्रतिक्रिया और समीक्षा', 'te-IN': 'అభిప్రాయం & సమీక్ష' },
    'logout': { 'en-US': 'Logout', 'hi-IN': 'लॉग आउट', 'te-IN': 'లాగ్ అవుట్' },
    'language': { 'en-US': 'Language', 'hi-IN': 'भाषा', 'te-IN': 'భాష' },
    'back': { 'en-US': 'Back', 'hi-IN': 'पीछे', 'te-IN': 'వెనుకకు' },
    'login': { 'en-US': 'Login', 'hi-IN': 'लॉगिन', 'te-IN': 'లాగిన్' },
    'about': { 'en-US': 'About', 'hi-IN': 'के बारे में', 'te-IN': 'గురించి' },
    'contact': { 'en-US': 'Contact', 'hi-IN': 'संपर्क करें', 'te-IN': 'సంప్రదించండి' },

    // Welcome Page & Home
    'homepage_subtitle': { 
        'en-US': 'AI-Powered Environmental Health Analysis. Upload an image to detect risks and protect your community.', 
        'hi-IN': 'एआई-संचालित पर्यावरणीय स्वास्थ्य विश्लेषण। जोखिमों का पता लगाने और अपने समुदाय की रक्षा के लिए एक छवि अपलोड करें।',
        'te-IN': 'AI-ఆధారిత పర్యావరణ ఆరోగ్య విశ్లేషణ. ప్రమాదాలను గుర్తించడానికి మరియు మీ కమ్యూనిటీని రక్షించడానికి చిత్రాన్ని అప్‌లోడ్ చేయండి.' 
    },
    'explore_globe': { 'en-US': 'Explore Globe', 'hi-IN': 'ग्लोब का अन्वेषण करें', 'te-IN': 'గ్లోబ్ అన్వేషించండి' },
    'get_started': { 'en-US': 'Get Started', 'hi-IN': 'शुरू करें', 'te-IN': 'ప్రారంభించండి' },
    'welcome_user': { 'en-US': 'Welcome, {name}!', 'hi-IN': 'स्वागत है, {name}!', 'te-IN': 'స్వాగతం, {name}!' },
    'what_today': { 'en-US': 'What would you like to do today?', 'hi-IN': 'आज आप क्या करना चाहेंगे?', 'te-IN': 'ఈరోజు మీరు ఏమి చేయాలనుకుంటున్నారు?' },
    'local_health_briefing': { 'en-US': 'Local Health Briefing', 'hi-IN': 'स्थानीय स्वास्थ्य ब्रीफिंग', 'te-IN': 'స్థానిక ఆరోగ్య సమాచారం' },
    'fetching_location': { 'en-US': 'Fetching your location...', 'hi-IN': 'आपकी स्थिति प्राप्त कर रहा है...', 'te-IN': 'మీ స్థానాన్ని గుర్తిస్తోంది...' },
    'view_full_forecast': { 'en-US': 'View Full Forecast →', 'hi-IN': 'पूर्ण पूर्वानुमान देखें →', 'te-IN': 'పూర్తి సూచన చూడండి →' },
    'hydration_tracker': { 'en-US': 'Hydration Tracker', 'hi-IN': 'हाइड्रेशन ट्रैकर', 'te-IN': 'హైడ్రేషన్ ట్రాకర్' },
    'log_water_cta': { 'en-US': 'Log Water →', 'hi-IN': 'पानी लॉग करें →', 'te-IN': 'నీరు నమోదు చేయండి →' },
    'activity_7_day': { 'en-US': 'Your 7-Day Activity', 'hi-IN': 'आपकी 7-दिवसीय गतिविधि', 'te-IN': 'మీ 7 రోజుల కార్యాచరణ' },
    'quick_actions': { 'en-US': 'Quick Actions', 'hi-IN': 'त्वरित कार्रवाई', 'te-IN': 'త్వరిత చర్యలు' },
    'goal_label': { 'en-US': 'Goal: {amount} ml', 'hi-IN': 'लक्ष्य: {amount} मिली', 'te-IN': 'లక్ష్యం: {amount} మి.లీ' },

    // Quick Action Cards
    'area_scan': { 'en-US': 'Area Scan', 'hi-IN': 'क्षेत्र स्कैन', 'te-IN': 'ఏరియా స్కాన్' },
    'area_scan_desc': { 'en-US': 'Analyze surroundings for risks', 'hi-IN': 'जोखिमों के लिए परिवेश का विश्लेषण करें', 'te-IN': 'ప్రమాదాల కోసం పరిసరాలను విశ్లేషించండి' },
    'symptom_checker': { 'en-US': 'Symptom Checker', 'hi-IN': 'लक्षण परीक्षक', 'te-IN': 'లక్షణాల తనిఖీ' },
    'symptom_checker_desc': { 'en-US': 'Get AI-driven insights', 'hi-IN': 'एआई-संचालित अंतर्दृष्टि प्राप्त करें', 'te-IN': 'AI-ఆధారిత అంతర్దృష్టులను పొందండి' },
    'script_reader': { 'en-US': 'Script Reader', 'hi-IN': 'स्क्रिप्ट रीडर', 'te-IN': 'స్క్రిప్ట్ రీడర్' },
    'script_reader_desc': { 'en-US': 'Interpret prescriptions easily', 'hi-IN': 'नुस्खे की आसानी से व्याख्या करें', 'te-IN': 'ప్రిస్క్రిప్షన్లను సులభంగా అర్థం చేసుకోండి' },
    'mind_check': { 'en-US': 'Mind Check', 'hi-IN': 'माइंड चेक', 'te-IN': 'మైండ్ చెక్' },
    'mind_check_desc': { 'en-US': 'Reflect on your well-being', 'hi-IN': 'अपनी भलाई पर चिंतन करें', 'te-IN': 'మీ శ్రేయస్సును ప్రతిబింబించండి' },
    'water_log': { 'en-US': 'Water Log', 'hi-IN': 'पानी का लॉग', 'te-IN': 'వాటర్ లాగ్' },
    'water_log_desc': { 'en-US': 'Track your daily intake', 'hi-IN': 'अपने दैनिक सेवन को ट्रैक करें', 'te-IN': 'మీ రోజువారి వినియోగాన్ని ట్రాక్ చేయండి' },

    // Symptom Checker Specific
    'symptom_checker_title': { 'en-US': 'AI Symptom Checker', 'hi-IN': 'एआई लक्षण परीक्षक', 'te-IN': 'AI లక్షణాల తనిఖీ' },
    'symptom_disclaimer_short': { 'en-US': 'This is not a medical diagnosis. Always consult a healthcare professional for advice.', 'hi-IN': 'यह एक चिकित्सा निदान नहीं है। सलाह के लिए हमेशा स्वास्थ्य देखभाल पेशेवर से परामर्श करें।', 'te-IN': 'ఇది వైద్య నిర్ధారణ కాదు. సలహా కోసం ఎల్లప్పుడూ ఆరోగ్య నిపుణుడిని సంప్రదించండి.' },
    'symptom_describe_label': { 'en-US': 'Describe your symptoms', 'hi-IN': 'अपने लक्षणों का वर्णन करें', 'te-IN': 'మీ లక్షణాలను వివరించండి' },
    'symptom_describe_detail': { 'en-US': 'Be as detailed as possible. Include when they started.', 'hi-IN': 'जितना संभव हो उतना विस्तृत रहें। बताएं कि वे कब शुरू हुए।', 'te-IN': 'సాధ్యమైనంత వివరంగా ఉండండి. అవి ఎప్పుడు ప్రారంభమయ్యాయో పేర్కొనండి.' },
    'symptom_placeholder_example': { 'en-US': "e.g., 'I have a sore throat and fever for 2 days...'", 'hi-IN': "उदा., 'मुझे 2 दिनों से गले में खराश और बुखार है...'", 'te-IN': "ఉదా., 'నాకు 2 రోజులుగా గొంతు నొప్పి మరియు జ్వరం ఉంది...'" },
    'symptom_placeholder_listening': { 'en-US': "Listening to your symptoms...", 'hi-IN': "आपके लक्षण सुन रहा हूँ...", 'te-IN': "మీ లక్షణాలను వింటున్నాను..." },
    'symptom_analyze_button': { 'en-US': 'Analyze My Symptoms', 'hi-IN': 'मेरे लक्षणों का विश्लेषण करें', 'te-IN': 'నా లక్షణాలను విశ్లేషించండి' },
    'symptom_analyzing_button': { 'en-US': 'Analyzing...', 'hi-IN': 'विश्लेषण किया जा रहा है...', 'te-IN': 'విశ్లేషిస్తోంది...' },
    'symptom_error_short_input': { 'en-US': 'Please describe your symptoms more clearly (at least 10 characters).', 'hi-IN': 'कृपया अपने लक्षणों का अधिक स्पष्ट रूप से वर्णन करें।', 'te-IN': 'దయచేసి మీ లక్షణాలను మరింత స్పష్టంగా వివరించండి.' },
    'language_label': { 'en-US': 'Analyzing in {lang}', 'hi-IN': '{lang} में विश्लेषण', 'te-IN': '{lang}లో విశ్లేషిస్తోంది' },
    'start_new_analysis': { 'en-US': 'Start New Analysis', 'hi-IN': 'नया विश्लेषण शुरू करें', 'te-IN': 'కొత్త విశ్లేషణను ప్రారంభించండి' },
    'informational_purposes_only': { 'en-US': 'For Informational Purposes Only', 'hi-IN': 'केवल सूचना के उद्देश्यों के लिए', 'te-IN': 'కేవలం సమాచార ప్రయోజనాల కోసం మాత్రమే' },
    'analysis_report_header': { 'en-US': 'Analysis Report', 'hi-IN': 'विश्लेषण रिपोर्ट', 'te-IN': 'విశ్లేషణ నివేదిక' },
    'triage_recommendation_label': { 'en-US': 'Triage Recommendation', 'hi-IN': 'ट्राइएज सिफारिश', 'te-IN': 'ట్రయాజ్ సిఫార్సు' },
    'symptom_summary_label': { 'en-US': 'Symptom Summary', 'hi-IN': 'लक्षण सारांश', 'te-IN': 'లక్షణాల సారాంశం' },
    'potential_conditions_label': { 'en-US': 'Potential Conditions for Discussion', 'hi-IN': 'चर्चा के लिए संभावित स्थितियां', 'te-IN': 'చర్చించవలసిన సంభావ్య పరిస్థితులు' },
    'next_steps_label': { 'en-US': 'Recommended Next Steps', 'hi-IN': 'अनुशंसित अगले कदम', 'te-IN': 'సిఫార్సు చేయబడిన తదుపరి చర్యలు' },
    'educational_videos_label': { 'en-US': 'Recommended Educational Videos', 'hi-IN': 'अनुशंसित शैक्षिक वीडियो', 'te-IN': 'సిఫార్సు చేయబడిన ట్యుటోరియల్స్' },

    // Schedule Checkup Specific
    'schedule_checkup_title': { 'en-US': 'Schedule a Checkup', 'hi-IN': 'चेकअप का समय निर्धारित करें', 'te-IN': 'చెకప్ షెడ్యూల్ చేయండి' },
    'schedule_checkup_subtitle': { 'en-US': 'Take the next step towards ensuring your health and safety. Choose an option below.', 'hi-IN': 'अपने स्वास्थ्य और सुरक्षा को सुनिश्चित करने की दिशा में अगला कदम उठाएं। नीचे एक विकल्प चुनें।', 'te-IN': 'మీ ఆరోగ్యం మరియు భద్రతను నిర్ధారించడానికి తదుపరి అడుగు వేయండి. క్రింది ఒక ఎంపికను ఎంచుకోండి.' },
    'community_resources_title': { 'en-US': 'Community Health Resources', 'hi-IN': 'सामुदायिक स्वास्थ्य संसाधन', 'te-IN': 'కమ్యూనిటీ ఆరోగ్య వనరులు' },
    'community_resources_desc': { 'en-US': 'Find nearby facilities worldwide', 'hi-IN': 'दुनिया भर में आस-पास की सुविधाएं खोजें', 'te-IN': 'ప్రపంచవ్యాప్తంగా సమీపంలోని సౌకర్యాలను కనుగొనండి' },
    'personalized_visit_title': { 'en-US': 'Personalized In-Person Visit', 'hi-IN': 'व्यक्तिगत व्यक्तिगत मुलाकात', 'te-IN': 'వ్యక్తిగత ప్రత్యక్ష సందర్శన' },
    'paid_consultation': { 'en-US': 'Paid consultation', 'hi-IN': 'सशुल्क परामर्श', 'te-IN': 'చెల్లింపు సంప్రదింపులు' },
    'form_fill_desc': { 'en-US': "Fill out the form to request a health professional visit. We'll confirm your appointment via email.", 'hi-IN': 'स्वास्थ्य पेशेवर की मुलाकात का अनुरोध करने के लिए फॉर्म भरें। हम ईमेल के माध्यम से आपके अपॉइंटमेंट की पुष्टि करेंगे।', 'te-IN': 'ఆరోగ్య నిపుణుల సందర్శనను అభ్యర్థించడానికి ఫారమ్‌ను పూరించండి. మేము ఇమెయిల్ ద్వారా మీ అపాయింట్‌మెంట్‌ని ధృవీకరిస్తాము.' },
    'form_full_name': { 'en-US': 'Full Name', 'hi-IN': 'पूरा नाम', 'te-IN': 'పూర్తి పేరు' },
    'form_email': { 'en-US': 'Email for Confirmation', 'hi-IN': 'पुष्टि के लिए ईमेल', 'te-IN': 'ధృవీకరణ కోసం ఇమెయిల్' },
    'form_address': { 'en-US': 'Full Address', 'hi-IN': 'पूरा पता', 'te-IN': 'పూర్తి చిరునామా' },
    'form_phone': { 'en-US': 'Phone Number', 'hi-IN': 'फ़ोन नंबर', 'te-IN': 'ఫోన్ నంబర్' },
    'form_date': { 'en-US': 'Preferred Date', 'hi-IN': 'पसंदीदा तारीख', 'te-IN': 'ప్రాధాన్యత తేదీ' },
    'form_request_button': { 'en-US': 'Request Visit', 'hi-IN': 'मुलाकात का अनुरोध करें', 'te-IN': 'సందర్శనను అభ్యర్థించండి' },
    'form_verifying_address': { 'en-US': 'Verifying address...', 'hi-IN': 'पता सत्यापित किया जा रहा है...', 'te-IN': 'చిరునామాను ధృవీకరిస్తోంది...' },
    'form_verified_location': { 'en-US': 'Verified Location', 'hi-IN': 'सत्यापित स्थान', 'te-IN': 'ధృవీకరించబడిన స్థానం' },
    'form_verify_prompt': { 'en-US': 'Please verify your address before requesting a visit.', 'hi-IN': 'मुलाकात का अनुरोध करने से पहले कृपया अपना पता सत्यापित करें।', 'te-IN': 'సందర్శనను అభ్యర్థించడానికి ముందు దయచేసి మీ చిరునామాను ధృవీకరించండి.' },
    'enter_city_address': { 'en-US': 'Enter a City or Address', 'hi-IN': 'शहर या पता दर्ज करें', 'te-IN': 'నగరం లేదా చిరునామాను నమోదు చేయండి' },
    'use_current_location': { 'en-US': 'Use My Current Location', 'hi-IN': 'मेरे वर्तमान स्थान का उपयोग करें', 'te-IN': 'నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి' },
    'directions_button': { 'en-US': 'Navigate', 'hi-IN': 'दिशानिर्देश', 'te-IN': 'దిశానిర్దేశం' },
    'appointment_requested': { 'en-US': 'Appointment Requested!', 'hi-IN': 'अपॉइंटमेंट का अनुरोध किया गया!', 'te-IN': 'అపాయింట్‌మెంట్ అభ్యర్థించబడింది!' },
    'booking_summary': { 'en-US': 'Booking Summary:', 'hi-IN': 'बुकिंग सारांश:', 'te-IN': 'బుకింగ్ సారాంశం:' },
    'location_finding_facilities': { 'en-US': 'Locating facilities near you...', 'hi-IN': 'आपके पास सुविधाओं का पता लगाया जा रहा है...', 'te-IN': 'మీ సమీపంలో సౌకర్యాలను గుర్తిస్తోంది...' },

    // Prescription Reader Specific
    'prescription_title': { 'en-US': 'Prescription Analysis', 'hi-IN': 'नुस्खा विश्लेषण', 'te-IN': 'ప్రిస్క్రిప్షన్ విశ్లేషణ' },
    'prescription_subtitle': { 'en-US': 'Upload a prescription to extract medical data and find pharmacies.', 'hi-IN': 'चिकित्सा डेटा निकालने और फ़ार्मेसी खोजने के लिए एक नुस्खा अपलोड करें।', 'te-IN': 'వైద్య డేటాను సంగ్రహించడానికి మరియు ఫార్మసీలను కనుగొనడానికి ప్రిస్క్రిప్షన్‌ను అప్‌లోడ్ చేయండి.' },
    'upload_prescription_label': { 'en-US': 'Upload Prescription Image', 'hi-IN': 'नुस्खा छवि अपलोड करें', 'te-IN': 'ప్రిస్క్రిప్షన్ చిత్రాన్ని అప్‌లోడ్ చేయండి' },
    'analyze_prescription_button': { 'en-US': 'Analyze Prescription', 'hi-IN': 'नुस्खे का विश्लेषण करें', 'te-IN': 'ప్రిస్క్రిప్షన్‌ను విశ్లేషించండి' },
    'prescription_summary_label': { 'en-US': 'Prescription Summary', 'hi-IN': 'नुस्खा सारांश', 'te-IN': 'ప్రిస్క్రిప్షన్ సారాంశం' },
    'medicines_label': { 'en-US': 'Identified Medicines', 'hi-IN': 'पहचानी गई दवाएं', 'te-IN': 'గుర్తించబడిన మందులు' },
    'safety_guides_label': { 'en-US': 'Safety Tutorials & Guides', 'hi-IN': 'सुरक्षा ट्यूटोरियल और गाइड', 'te-IN': 'భద్రతా ట్యుటోరియల్స్ & గైడ్లు' },
    'precautions_label': { 'en-US': 'Precautions & Instructions', 'hi-IN': 'सावधानियां और निर्देश', 'te-IN': 'జాగ్రత్తలు & సూచనలు' },
    'nearby_pharmacies_label': { 'en-US': 'Nearby Pharmacies & Hospitals', 'hi-IN': 'पास के फार्मेसी और अस्पताल', 'te-IN': 'సమీపంలోని ఫార్మసీలు & ఆసుపత్రులు' },
    'locate_pharmacies_desc': { 'en-US': 'Locate where to buy your medicines', 'hi-IN': 'पता लगाएं कि आपकी दवाएं कहां से खरीदनी हैं', 'te-IN': 'మీ మందులను ఎక్కడ కొనాలో గుర్తించండి' },
    'find_nearby_shops_button': { 'en-US': 'Find Nearby Medical Shops', 'hi-IN': 'पास की मेडिकल दुकानें खोजें', 'te-IN': 'సమీపంలోని మెడికల్ షాపులను కనుగొనండి' },
    'explore_on_maps': { 'en-US': 'Explore on Maps', 'hi-IN': 'मैप्स पर देखें', 'te-IN': 'మ్యాప్‌లో అన్వేషించండి' },

    // Area Scan Page Additional
    'upload_area_scan': { 'en-US': 'Upload Area Scan', 'hi-IN': 'क्षेत्र स्कैन अपलोड करें', 'te-IN': 'ఏరియా స్కాన్ అప్‌లోడ్ చేయండి' },
    'analyze_image': { 'en-US': 'Analyze Image', 'hi-IN': 'छवि का विश्लेषण करें', 'te-IN': 'చిత్రాన్ని విశ్లేషించండి' },
    'awaiting_analysis': { 'en-US': 'Awaiting Analysis', 'hi-IN': 'विश्लेषण की प्रतीक्षा है', 'te-IN': 'విశ్లేషణ కోసం వేచి ఉంది' },
    'analysis_report': { 'en-US': 'Analysis Report', 'hi-IN': 'विश्लेषण रिपोर्ट', 'te-IN': 'విశ్లేషణ నివేదిక' },
    'schedule_checkup_cta': { 'en-US': 'Schedule Checkup', 'hi-IN': 'चेकअप निर्धारित करें', 'te-IN': 'చెకప్ షెడ్యూల్ చేయండి' },
    'overall_assessment': { 'en-US': 'Overall Assessment', 'hi-IN': 'समग्र मूल्यांकन', 'te-IN': 'మొత్తం అంచనా' },
    'identified_hazards': { 'en-US': 'Identified Hazards', 'hi-IN': 'पहचाने गए खतरे', 'te-IN': 'గుర్తించబడిన ప్రమాదాలు' },

    // Mental Health Specific
    'mind_check_header': { 'en-US': 'Mental Wellness Check-in', 'hi-IN': 'मानसिक स्वास्थ्य चेक-इन', 'te-IN': 'మానసిక ఆరోగ్య తనిఖీ' },
    'mind_check_intro_title': { 'en-US': 'A Moment for You', 'hi-IN': 'आपके लिए एक पल', 'te-IN': 'మీ కోసం ఒక క్షణం' },
    'mind_check_intro_desc': { 'en-US': 'Take a brief moment to check in with your well-being.', 'hi-IN': 'अपनी भलाई की जांच करने के लिए एक संक्षिप्त क्षण लें।', 'te-IN': 'మీ శ్రేయస్సును తనిఖీ చేయడానికి ఒక చిన్న సమయాన్ని వెచ్చించండి.' },
    'begin_checkin': { 'en-US': 'Begin Check-in', 'hi-IN': 'चेక్-इन शुरू करें', 'te-IN': 'తనిఖీని ప్రారంభించండి' },
    'question_label': { 'en-US': 'QUESTION {current} OF {total}', 'hi-IN': 'सवाल {current} में से {total}', 'te-IN': 'ప్రశ్న {current} / {total}' },
    'checkin_complete': { 'en-US': 'Check-in Complete!', 'hi-IN': 'चेक-इन पूरा हुआ!', 'te-IN': 'తనిఖీ పూర్తయింది!' },
    'get_reflection': { 'en-US': 'Get My Reflection', 'hi-IN': 'मेरा प्रतिबिंब प्राप्त करें', 'te-IN': 'నా ప్రతిబింబాన్ని పొందండి' },
    'wellness_reflection_label': { 'en-US': 'Your Wellness Reflection', 'hi-IN': 'आपका वेलनेस प्रतिबिंब', 'te-IN': 'మీ శ్రేయస్సు ప్రతిబింబం' },
    'areas_reflection_label': { 'en-US': 'Areas for Reflection', 'hi-IN': 'प्रतिबिंब के लिए क्षेत्र', 'te-IN': 'ప్రతిబింబం కోసం అంశాలు' },
    'coping_strategies_label': { 'en-US': 'Helpful Coping Strategies', 'hi-IN': 'सहायक मुकाबला रणनीतियां', 'te-IN': 'సహాయకరమైన కోపింగ్ వ్యూహాలు' },

    // ChatBot Additional
    'chatbot_welcome': { 'en-US': 'Hello! I am GeoSick Pro. How can I help you with your health today?', 'hi-IN': 'नमस्ते! मैं जियोसिक प्रो हूँ। आज मैं आपके स्वास्थ्य में कैसे मदद कर सकता हूँ?', 'te-IN': 'నమస్కారం! నేను GeoSick Pro. ఈరోజు మీ ఆరోగ్యానికి నేను ఎలా సహాయపడగలను?' },
    'chatbot_analyzing': { 'en-US': 'Analyzing your request...', 'hi-IN': 'आपके अनुरोध का विश्लेषण किया जा रहा है...', 'te-IN': 'మీ అభ్యర్థనను విశ్లేషిస్తోంది...' },
    'chatbot_error': { 'en-US': 'Sorry, I encountered an error. Please try again.', 'hi-IN': 'क्षमा करें, मुझे एक त्रुटि मिली। कृपया पुन: प्रयास करें।', 'te-IN': 'క్షమించండి, నాకు ఒక దోషం ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి.' },
    'stop': { 'en-US': 'Stop', 'hi-IN': 'रुकें', 'te-IN': 'ఆపు' },
    'mute': { 'en-US': 'Mute', 'hi-IN': 'म्यूट', 'te-IN': 'మ్యూట్' },
    'unmute': { 'en-US': 'Unmute', 'hi-IN': 'अनम्यूट', 'te-IN': 'అన్‌మ్యూట్' },
};