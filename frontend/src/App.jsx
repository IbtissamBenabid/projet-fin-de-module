import React, { useState } from 'react';
import { Shield, Fingerprint, UserCheck, Activity, Users, Lock, ChevronRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen p-8">
            <div className="grid-bg"></div>

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 glass p-4 px-8">
                <div className="flex items-center gap-2">
                    <Shield className="text-primary w-8 h-8" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        BioTrust
                    </span>
                </div>

                <div className="flex gap-6">
                    {['dashboard', 'enrollment', 'verify', 'audit'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize font-medium transition-colors ${activeTab === tab ? 'text-primary' : 'text-text-muted hover:text-text'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <button className="btn-primary flex items-center gap-2">
                    <Lock size={18} />
                    Session Sécurisée
                </button>
            </nav>

            <main className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <StatCard icon={<Users />} title="Total Enrôlés" value="1,284" trend="+12% ce mois" />
                            <StatCard icon={<UserCheck />} title="Vérifications Réussies" value="99.8%" trend="FAR: 0.001%" />
                            <StatCard icon={<Activity />} title="Alertes Sécurité" value="0" trend="Système Stable" />

                            <div className="md:col-span-2 glass card p-8">
                                <h3 className="text-xl font-bold mb-6">Activités Récentes</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-primary/20 rounded-lg"><UserCheck size={20} className="text-primary" /></div>
                                                <div>
                                                    <p className="font-semibold">Vérification de l'ID #REF-782{i}</p>
                                                    <p className="text-sm text-text-muted">Centre : Casablanca Anfa | 14:2{i}</p>
                                                </div>
                                            </div>
                                            <span className="text-success font-bold">MATCH 99%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass card p-8 flex flex-col justify-center items-center text-center">
                                <Fingerprint size={64} className="text-secondary mb-4 animate-pulse-slow" />
                                <h3 className="text-xl font-bold mb-2">Scanner Prêt</h3>
                                <p className="text-text-muted mb-6">En attente d'une entrée biométrique pour l'identification rapide.</p>
                                <button className="w-full btn-primary">Lancer le Scan</button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'enrollment' && (
                        <motion.div
                            key="enrollment"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto glass card p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Camera className="text-primary" /> Nouvel Enrôlement Biométrique
                            </h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">Prénom</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary" placeholder="Jean" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">Nom</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary" placeholder="Dupont" />
                                    </div>
                                </div>

                                <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors">
                                    <div className="p-4 bg-primary/10 rounded-full"><Camera className="text-primary" size={32} /></div>
                                    <p className="text-text-muted">Prendre une photo du visage (Vérification de vivacité auto-activée)</p>
                                    <button type="button" className="btn-primary">Activer Caméra</button>
                                </div>

                                <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-secondary/50 transition-colors">
                                    <div className="p-4 bg-secondary/10 rounded-full"><Fingerprint className="text-secondary" size={32} /></div>
                                    <p className="text-text-muted">Scanner l'empreinte digitale (Index Droit)</p>
                                    <button type="button" className="btn-primary" style={{ background: 'var(--secondary)' }}>Initialiser Scanner</button>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input type="checkbox" id="consent" className="mt-1" />
                                    <label htmlFor="consent" className="text-xs text-text-muted">
                                        Je consens au traitement de mes données biométriques conformément à la Loi 08.09. Les données brutes seront supprimées après extraction des descripteurs chiffrés.
                                    </label>
                                </div>

                                <button type="submit" className="w-full btn-primary py-4 text-lg">Finaliser l'Enrôlement et Générer le Digital ID</button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend }) => (
    <div className="glass card p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl text-primary">{icon}</div>
            <span className="text-xs font-bold text-success px-2 py-1 bg-success/10 rounded-full">{trend}</span>
        </div>
        <h4 className="text-text-muted text-sm font-medium">{title}</h4>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
);

export default App;
