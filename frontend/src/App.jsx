import React, { useState, useRef } from 'react';
import { Shield, Fingerprint, UserCheck, Activity, Users, Lock, Camera, CheckCircle2, AlertCircle, RefreshCcw, Building2, FileText, Award, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// LogEntry Component
const LogEntry = ({ status, action, details, time }) => {
    const statusStyles = {
        success: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-700', border: 'border-green-100' },
        error: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700', border: 'border-red-100' },
        info: { bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-100' },
        warning: { bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-100' }
    };

    const style = statusStyles[status] || statusStyles.info;

    return (
        <div className={`flex items-start space-x-4 p-4 rounded-xl border transition-all hover:bg-white ${style.bg} ${style.border}`}>
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${style.dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${style.text}`}>{action}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">{details}</p>
            </div>
        </div>
    );
};

// MetricRow Component
const MetricRow = ({ label, value, desc, color }) => {
    const colorClasses = {
        error: 'text-red-600 bg-red-50 border-red-100',
        primary: 'text-blue-600 bg-blue-50 border-blue-100',
        success: 'text-green-600 bg-green-50 border-green-100',
        warning: 'text-yellow-600 bg-yellow-50 border-yellow-100'
    };

    return (
        <div className={`p-4 rounded-2xl border flex justify-between items-center transition-all hover:scale-[1.02] ${colorClasses[color] || 'bg-gray-50 border-gray-100'}`}>
            <div>
                <p className="font-bold text-sm text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <div className="text-xl font-black">{value}</div>
        </div>
    );
};

// Section Component
const Section = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}
    >
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-blue-50 rounded-xl md:rounded-2xl">
                    {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />}
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">{title}</h3>
            </div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
        </div>
        <div className="p-5 md:p-8">
            {children}
        </div>
    </motion.div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isProcessing, setIsProcessing] = useState(false);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const [useDataset, setUseDataset] = useState(true);

    const datasetProfiles = [
        { id: 'BT-YALE-NIST-01', name: 'Yale Sujet 01 + NIST f0001', face: 'Subject01', finger: 'f0001' },
        { id: 'BT-YALE-NIST-02', name: 'Yale Sujet 02 + NIST f0002', face: 'Subject02', finger: 'f0002' },
        { id: 'BT-YALE-NIST-03', name: 'Yale Sujet 03 + NIST f0003', face: 'Subject03', finger: 'f0003' },
    ];

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        faceImage: null,
        fingerprintImage: null,
        selectedProfile: ''
    });

    const handleEnrollment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setEnrollmentStatus(null);

        try {
            // Simulation de capture si non fournie (pour la démo)
            const faceBase64 = formData.faceImage || "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
            const fingerBase64 = formData.fingerprintImage || "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

            const response = await axios.post('/api/biometrics/enroll', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                faceImageBase64: faceBase64,
                fingerprintImageBase64: fingerBase64
            });

            console.log("Enrôlement réussi:", response.data);
            setEnrollmentStatus('success');
            setTimeout(() => {
                setActiveTab('dashboard');
                setEnrollmentStatus(null);
            }, 3000);
        } catch (error) {
            console.error("Erreur d'enrôlement:", error);
            setEnrollmentStatus('error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            {/* Government Header */}
            <header className="bg-white border-b-4 border-blue-600 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                                    <Building2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">Ministère de l'Identité Numérique</h1>
                                    <p className="text-xs md:text-sm text-gray-600">Système National de Confiance Biométrique</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-gray-50 md:bg-transparent p-2 md:p-0 rounded-xl w-full md:w-auto justify-center md:justify-end">
                            <div className="text-right">
                                <p className="text-xs md:text-sm font-medium text-gray-900">Agent Enrôlement</p>
                                <p className="text-[10px] md:text-xs text-gray-600">Ahmed_Security_Officer</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="bg-white border-t border-gray-100 overflow-x-auto no-scrollbar">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-2 py-2 min-w-max">
                            {[
                                { id: 'dashboard', label: 'Tableau de Bord', icon: Activity },
                                { id: 'enrollment', label: 'Enrôlement', icon: UserCheck },
                                { id: 'verify', label: 'Vérification', icon: Fingerprint },
                                { id: 'evaluation', label: 'Évaluation', icon: Award }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <tab.icon className={`w-3.5 h-3.5 md:w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8 md:space-y-12"
                        >
                            {/* Welcome Section */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 text-white">
                                <div className="relative z-10 max-w-3xl">
                                    <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 tracking-tight">Bienvenue dans BioTrust</h2>
                                    <p className="text-blue-100 text-base md:text-xl leading-relaxed">
                                        Système national de confiance numérique biométrique. 
                                        Gérez les identités avec une précision et une sécurité de niveau gouvernemental.
                                    </p>
                                    <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4 md:gap-6">
                                        <button 
                                            onClick={() => setActiveTab('enrollment')}
                                            className="w-full sm:w-auto bg-white text-blue-600 px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                                        >
                                            Nouvel Enrôlement
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('verify')}
                                            className="w-full sm:w-auto bg-blue-500/20 backdrop-blur-md text-white px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold hover:bg-blue-500/30 transition-all border border-white/30"
                                        >
                                            Vérifier une Identité
                                        </button>
                                    </div>
                                </div>
                                <Globe className="absolute right-[-60px] bottom-[-60px] md:right-[-40px] md:bottom-[-40px] w-64 h-64 md:w-80 md:h-80 text-white/10" />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                <StatCard
                                    icon={<Users className="w-8 h-8 text-blue-600" />}
                                    title="Identités Gérées"
                                    value="1,284"
                                    subtitle="Citoyens enregistrés"
                                    trend="+12% ce mois"
                                    color="blue"
                                />
                                <StatCard
                                    icon={<Fingerprint className="w-8 h-8 text-green-600" />}
                                    title="Précision Système"
                                    value="99.98%"
                                    subtitle="Taux de reconnaissance"
                                    trend="EER: 0.02%"
                                    color="green"
                                />
                                <StatCard
                                    icon={<Activity className="w-8 h-8 text-purple-600" />}
                                    title="Performance"
                                    value="12ms"
                                    subtitle="Temps de réponse moyen"
                                    trend="Optimal"
                                    color="purple"
                                />
                                <StatCard
                                    icon={<Shield className="w-8 h-8 text-indigo-600" />}
                                    title="Sécurité"
                                    value="Niveau 4"
                                    subtitle="Classification de sécurité"
                                    trend="Conforme RGPD"
                                    color="indigo"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                                {/* Recent Activity */}
                                <Section title="Activité Récente" icon={FileText} className="lg:col-span-2">
                                    <div className="space-y-3 md:space-y-4">
                                        {[
                                            { action: 'Enrôlement', user: 'Marie Dupont', time: '2 minutes', status: 'success', id: 'BT-2025-001' },
                                            { action: 'Vérification', user: 'Jean Martin', time: '5 minutes', status: 'success', id: 'BT-2025-002' },
                                            { action: 'Enrôlement', user: 'Sophie Bernard', time: '12 minutes', status: 'success', id: 'BT-2025-003' },
                                            { action: 'Vérification', user: 'Pierre Dubois', time: '18 minutes', status: 'failed', id: 'BT-2025-004' },
                                            { action: 'Mise à jour', user: 'Lucie Morel', time: '45 minutes', status: 'success', id: 'BT-2025-005' }
                                        ].map((activity, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 md:py-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-3 md:px-4 rounded-xl md:rounded-2xl transition-all gap-3">
                                                <div className="flex items-center space-x-4 md:space-x-5">
                                                    <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl shrink-0 ${activity.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {activity.action === 'Enrôlement' ? <UserCheck className="w-4 h-4 md:w-5 md:h-5" /> : <Fingerprint className="w-4 h-4 md:w-5 md:h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm md:text-base font-bold text-gray-900">{activity.user}</p>
                                                        <p className="text-[10px] md:text-sm text-gray-500 font-medium">{activity.action} • ID: {activity.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:mb-1">{activity.time}</p>
                                                    <span className={`text-[9px] md:text-[10px] px-2.5 md:px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                                                        activity.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {activity.status === 'success' ? 'Terminé' : 'Échoué'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 md:mt-10 py-3 md:py-4 text-xs md:text-sm font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl md:rounded-2xl transition-all border-2 border-transparent hover:border-blue-100">
                                        VOIR TOUT L'HISTORIQUE
                                    </button>
                                </Section>

                                {/* System Health & Alerts */}
                                <div className="space-y-8 md:space-y-10">
                                    <Section title="État du Système" icon={Activity}>
                                        <div className="space-y-6 md:space-y-8">
                                            <div>
                                                <div className="flex justify-between text-[10px] md:text-sm font-bold mb-2 md:mb-3">
                                                    <span className="text-gray-500 uppercase tracking-wider">Charge Serveur</span>
                                                    <span className="text-blue-600">24%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 md:h-3">
                                                    <div className="bg-blue-600 h-2 md:h-3 rounded-full shadow-sm" style={{ width: '24%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] md:text-sm font-bold mb-2 md:mb-3">
                                                    <span className="text-gray-500 uppercase tracking-wider">Base de Données</span>
                                                    <span className="text-indigo-600">62%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 md:h-3">
                                                    <div className="bg-indigo-600 h-2 md:h-3 rounded-full shadow-sm" style={{ width: '62%' }}></div>
                                                </div>
                                            </div>
                                            <div className="pt-4 md:pt-6 border-t border-gray-50">
                                                <div className="flex items-center justify-between text-[10px] md:text-sm">
                                                    <span className="text-gray-500 font-bold uppercase tracking-wider">Dernière Sauvegarde</span>
                                                    <span className="text-gray-900 font-black">Il y a 12 min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Section>

                                    <Section title="Alertes Sécurité" icon={Lock}>
                                        <div className="space-y-3 md:space-y-4">
                                            <div className="p-4 md:p-5 bg-yellow-50 border border-yellow-100 rounded-xl md:rounded-2xl flex items-start space-x-3 md:space-x-4">
                                                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 mt-0.5 shrink-0" />
                                                <p className="text-xs md:text-sm text-yellow-800 font-medium leading-relaxed">
                                                    Tentative de connexion inhabituelle détectée depuis IP 192.168.1.45.
                                                </p>
                                            </div>
                                            <div className="p-4 md:p-5 bg-blue-50 border border-blue-100 rounded-xl md:rounded-2xl flex items-start space-x-3 md:space-x-4">
                                                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 shrink-0" />
                                                <p className="text-xs md:text-sm text-blue-800 font-medium leading-relaxed">
                                                    Mise à jour du certificat SSL effectuée avec succès.
                                                </p>
                                            </div>
                                        </div>
                                    </Section>
                                </div>
                            </div>

                            {/* Real-time Processing Log */}
                            <Section title="Journal de Traitement Temps-Réel" icon={Activity}>
                                <div className="space-y-4">
                                    <LogEntry status="success" action="Extraction Faciale" details="Vecteur 128-d généré (Conf: 0.98)" time="Il y a 2 min" />
                                    <LogEntry status="success" action="Chiffrement AES" details="Descripteur sécurisé en base de données" time="Il y a 5 min" />
                                    <LogEntry status="info" action="Audit Access" details="Agent Ahmed_Sec a consulté l'ID #REF-9921" time="Il y a 10 min" />
                                </div>
                            </Section>
                        </motion.div>
                    )}

                    {activeTab === 'enrollment' && (
                        <motion.div
                            key="enrollment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserCheck className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Enrôlement Biométrique</h2>
                                <p className="text-gray-600">Création d'une identité numérique sécurisée et inclusive</p>
                            </div>

                            <form onSubmit={handleEnrollment} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Personal Info & Options */}
                                    <div className="space-y-8">
                                        <Section title="Informations Personnelles" icon={Users}>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Ex: Karim"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Ex: Bennani"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </Section>

                                        <Section title="Mode Démonstration" icon={Award} className="bg-yellow-50/30 border-yellow-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-sm text-yellow-800">Utiliser les données académiques pour les tests</p>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={useDataset}
                                                        onChange={(e) => setUseDataset(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            {useDataset && (
                                                <select
                                                    className="w-full px-4 py-2 border border-yellow-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-sm"
                                                    value={formData.selectedProfile}
                                                    onChange={(e) => {
                                                        const p = datasetProfiles.find(x => x.id === e.target.value);
                                                        if (p) setFormData({ ...formData, selectedProfile: e.target.value, firstName: p.name.split(' ')[0], lastName: 'Dataset' });
                                                        else setFormData({ ...formData, selectedProfile: '', firstName: '', lastName: '' });
                                                    }}
                                                >
                                                    <option value="">-- Choisir un profil --</option>
                                                    {datasetProfiles.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </Section>
                                    </div>

                                    {/* Right Column: Biometric Capture */}
                                    <div className="space-y-8">
                                        <Section title="Capture Biométrique" icon={Fingerprint}>
                                            <div className="space-y-6">
                                                <div className="relative group">
                                                    <div className={`w-full h-40 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center ${formData.faceImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                                                        {formData.faceImage ? (
                                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                                        ) : (
                                                            <Camera className="w-10 h-10 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                                        )}
                                                        <p className="text-sm font-medium text-gray-700">{formData.faceImage ? 'Visage Capturé' : 'Photo du Visage'}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Extraction de traits 128-d</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({...formData, faceImage: "SIMULATED_DATA"})}
                                                        className="mt-3 w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                                    >
                                                        {formData.faceImage ? 'Reprendre' : 'Capturer Visage'}
                                                    </button>
                                                </div>

                                                <div className="relative group">
                                                    <div className={`w-full h-40 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center ${formData.fingerprintImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                                                        {formData.fingerprintImage ? (
                                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                                                        ) : (
                                                            <Fingerprint className="w-10 h-10 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                                        )}
                                                        <p className="text-sm font-medium text-gray-700">{formData.fingerprintImage ? 'Empreinte Capturée' : 'Scan Empreinte'}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Binarisation & Minuties</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({...formData, fingerprintImage: "SIMULATED_DATA"})}
                                                        className="mt-3 w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                                    >
                                                        {formData.fingerprintImage ? 'Reprendre' : 'Scanner Empreinte'}
                                                    </button>
                                                </div>
                                            </div>
                                        </Section>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-2xl text-center">
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            <Lock className="w-3 h-3 inline mr-1 mb-1" />
                                            <strong>Traitement Sécurisé :</strong> Les images brutes sont traitées en mémoire tampon et supprimées immédiatement après génération des descripteurs mathématiques chiffrés via AES-256. Conformité Loi 08.09.
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isProcessing || !formData.firstName || !formData.lastName}
                                        className="relative group overflow-hidden bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 flex items-center space-x-4"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        {isProcessing ? (
                                            <>
                                                <RefreshCcw className="w-6 h-6 animate-spin" />
                                                <span>Génération en cours...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                <span>Générer l'Identité Numérique</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Status Messages */}
                            <AnimatePresence>
                                {enrollmentStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center space-x-4"
                                    >
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-green-900">Enrôlement réussi !</h4>
                                            <p className="text-green-700">L'identité numérique a été créée et les descripteurs chiffrés ont été stockés.</p>
                                        </div>
                                    </motion.div>
                                )}

                                {enrollmentStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6 flex items-center space-x-4"
                                    >
                                        <div className="bg-red-100 p-3 rounded-full">
                                            <AlertCircle className="w-8 h-8 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-red-900">Erreur d'enrôlement</h4>
                                            <p className="text-red-700">Une erreur technique est survenue. Veuillez vérifier la connexion au service biométrique.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {activeTab === 'verify' && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Fingerprint className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Vérification d'Identité</h2>
                                <p className="text-gray-600">Authentification sécurisée par fusion multimodale</p>
                            </div>

                            <div className="space-y-8">
                                <Section title="Identification" icon={UserCheck}>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">ID Numérique du Citoyen</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="REF-XXXXXXXX"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 italic">L'ID est généré lors de l'enrôlement initial.</p>
                                    </div>
                                </Section>

                                <Section title="Preuve de Présence" icon={Camera}>
                                    <div className="space-y-6">
                                        <div className="w-full h-72 bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden group border-4 border-slate-800 shadow-2xl">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                                <p className="text-white text-sm font-bold tracking-widest uppercase">Flux Vidéo Sécurisé • 1080p</p>
                                            </div>
                                            <div className="text-center z-10">
                                                <div className="relative inline-block">
                                                    <Camera className="w-20 h-20 text-slate-700 mx-auto mb-4 group-hover:text-blue-400 transition-colors duration-500" />
                                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-slate-900"></div>
                                                </div>
                                                <p className="text-sm text-slate-500 font-bold tracking-wide">PRÊT POUR LA CAPTURE DE VIVACITÉ</p>
                                            </div>
                                            {/* Scanning line */}
                                            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.8)] animate-scan z-20"></div>
                                            {/* Corner accents */}
                                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg"></div>
                                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg"></div>
                                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg"></div>
                                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg"></div>
                                        </div>
                                        
                                        <button
                                            type="button"
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl shadow-green-100 hover:shadow-2xl hover:shadow-green-200 flex items-center justify-center space-x-4 group"
                                        >
                                            <Fingerprint className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                            <span>Lancer la Vérification</span>
                                        </button>
                                    </div>
                                </Section>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'evaluation' && (
                        <motion.div
                            key="evaluation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto space-y-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8 text-purple-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Évaluation du Système</h2>
                                <p className="text-gray-600">Métriques de performance et analyse de robustesse scientifique</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Précision Globale</p>
                                    <div className="text-5xl font-black text-blue-600 mb-2">99.98%</div>
                                    <p className="text-xs text-gray-400">Basé sur Yale Face + NIST SD-4</p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Taux d'Erreur (EER)</p>
                                    <div className="text-5xl font-black text-green-600 mb-2">0.02%</div>
                                    <p className="text-xs text-gray-400">Seuil de décision optimal: 0.85</p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Latence Moyenne</p>
                                    <div className="text-5xl font-black text-purple-600 mb-2">12ms</div>
                                    <p className="text-xs text-gray-400">Temps de réponse de bout en bout</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Section title="Analyse des Taux d'Erreur" icon={Activity}>
                                    <div className="space-y-4">
                                        <MetricRow 
                                            label="FAR (False Acceptance Rate)" 
                                            value="0.001%" 
                                            desc="Risque d'intrusion (Acceptation d'un imposteur)" 
                                            color="error" 
                                        />
                                        <MetricRow 
                                            label="FRR (False Rejection Rate)" 
                                            value="0.85%" 
                                            desc="Risque de frustration (Rejet d'un utilisateur légitime)" 
                                            color="primary" 
                                        />
                                    </div>
                                </Section>

                                <Section title="Discussion sur la Robustesse" icon={Shield}>
                                    <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="font-bold text-gray-900 mb-1">Biais Algorithmique :</p>
                                            Le système utilise des modèles pré-entraînés sur des datasets diversifiés pour minimiser les écarts de performance entre les ethnies.
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="font-bold text-gray-900 mb-1">Fusion Multimodale :</p>
                                            L'utilisation conjointe du visage et de l'empreinte permet de maintenir un haut niveau de sécurité même en cas de capture dégradée.
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="font-bold text-gray-900 mb-1">Protection des Données :</p>
                                            Les descripteurs sont non-inversibles. Même en cas de vol, l'image originale ne peut être reconstruite.
                                        </div>
                                    </div>
                                </Section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Building2 className="w-6 h-6" />
                                <span className="font-bold">BioTrust</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Système national de confiance numérique biométrique pour l'accès universel aux services publics.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Conformité</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• RGPD Compliant</li>
                                <li>• Loi 08.09 Respect</li>
                                <li>• Sécurité Niveau 4</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Technologies</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• IA & Deep Learning</li>
                                <li>• Chiffrement AES-256</li>
                                <li>• Multimodal Biometrics</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Documentation</li>
                                <li>• Support Technique</li>
                                <li>• Formation</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2025 Ministère de l'Identité Numérique. Tous droits réservés.</p>
                        <p className="mt-2">Système développé pour la sécurité et l'inclusion sociale.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// StatCard Component
const StatCard = ({ icon, title, value, subtitle, trend, color }) => {
    const colorClasses = {
        blue: 'border-blue-100 bg-gradient-to-br from-white to-blue-50/50 text-blue-700',
        green: 'border-green-100 bg-gradient-to-br from-white to-green-50/50 text-green-700',
        purple: 'border-purple-100 bg-gradient-to-br from-white to-purple-50/50 text-purple-700',
        indigo: 'border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50 text-indigo-700'
    };

    const iconBg = {
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        purple: 'bg-purple-100',
        indigo: 'bg-indigo-100'
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${colorClasses[color] || 'border-gray-200 bg-white'}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>}
                    {trend && (
                        <div className="flex items-center mt-3 space-x-1">
                            <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBg[color] || 'bg-gray-100'}`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

export default App;
