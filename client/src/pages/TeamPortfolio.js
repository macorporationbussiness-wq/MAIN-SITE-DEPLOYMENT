import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import PageHeader from '../components/PageHeader';

const colorPalette = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #8E2DE2, #4A00E0)',
    'linear-gradient(135deg, #11998e, #38ef7d)',
    'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
];

const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const getCategoryColor = (type) => {
    const colors = {
        'Web App': '#6C63FF',
        'Mobile App': '#4ECDC4',
        'Branding': '#FF6B6B',
        'UI/UX Design': '#FFE66D',
        'AI/ML': '#00D4AA',
        'Other': '#8B85FF',
    };
    return colors[type] || '#6C63FF';
};

const initials = (name) => {
    if (!name) return '👤';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
};

export default function TeamPortfolio() {
    const { slug } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchPortfolio = async () => {
            setPortfolio(null);
            setLoading(true);
            try {
                const res = await API.get(`/portfolios/${slug}`);
                setPortfolio(res.data || null);
            } catch (err) {
                setPortfolio(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, [slug]);

    const getImages = (p) => {
        if (p?.projectImages && p.projectImages.length > 0) {
            return p.projectImages;
        }
        return p?.projectImage ? [p.projectImage] : [];
    };

    const nextImage = () => {
        const imgs = getImages(portfolio);
        if (imgs.length > 1) {
            setCurrentImageIndex((i) => (i + 1) % imgs.length);
        }
    };

    const prevImage = () => {
        const imgs = getImages(portfolio);
        if (imgs.length > 1) {
            setCurrentImageIndex((i) => (i - 1 + imgs.length) % imgs.length);
        }
    };

    if (loading) {
        return (
            <div>
                <PageHeader eyebrow="TEAM PORTFOLIO" title="Loading…" subtitle="Fetching portfolio details…" />
                <section className="section-dark" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
                    <div className="container">
                        <p className="muted text-center">Loading portfolio…</p>
                    </div>
                </section>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div>
                <PageHeader eyebrow="TEAM PORTFOLIO" title="Not Found" subtitle="Portfolio not found." />
                <section className="section-dark" style={{ padding: '40px 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <Link to="/team" className="btn btn-primary">
                            Back to Team
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const p = portfolio;
    const member = p.teamMember && typeof p.teamMember === 'object' ? p.teamMember : null;
    const images = p ? getImages(p) : [];
    const gradient = colorPalette[0];

    return (
        <div>
            <PageHeader
                eyebrow="TEAM PORTFOLIO"
                title={member?.name || p.title}
                subtitle={member?.position || p.projectType}
            />

            <section className="section-dark" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
                <div className="container">
                    {member && (
                        <div className="card" style={{ marginBottom: 28, background: 'var(--card)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 24 }}>
                                <div
                                    style={{
                                        width: 64, height: 64, borderRadius: '50%',
                                        background: gradient,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, color: '#fff', fontSize: '1.4rem',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    {initials(member.name)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: 4, color: 'var(--text)' }}>{member.name}</h3>
                                    <p style={{ fontSize: '0.95rem', color: '#0ea5a4', fontWeight: 700 }}>{member.position}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hero Card */}
                    <div
                        className="card"
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            marginBottom: 32,
                            background: 'var(--card)',
                            border: '1px solid var(--border-dark)',
                            borderRadius: 'var(--radius)',
                        }}
                    >
                        <div
                            className="grid grid-2"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 0,
                            }}
                        >
                            {/* Left: Image Gallery Slider */}
                            <div style={{ position: 'relative' }}>
                                {(() => {
                                    const imgs = getImages(p);
                                    return imgs.length > 0 ? (
                                        <img
                                            key={currentImageIndex}
                                            src={imgs[currentImageIndex]}
                                            alt={`${p.title} - ${currentImageIndex + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 320 }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: 360,
                                                background: `linear-gradient(135deg, ${getCategoryColor(p.projectType)}, ${getCategoryColor(p.projectType)}99)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '3rem',
                                                fontWeight: 700,
                                                color: '#fff',
                                                fontFamily: 'var(--font-mono)',
                                            }}
                                        >
                                            {initials(p.teamMember?.name || p.teamMemberName || p.title)}
                                        </div>
                                    );
                                })()}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={prevImage}
                                            style={{
                                                position: 'absolute',
                                                left: 12,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.4)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#fff',
                                                fontSize: '1.2rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            style={{
                                                position: 'absolute',
                                                right: 12,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.4)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#fff',
                                                fontSize: '1.2rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            ›
                                        </button>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            gap: 6,
                                        }}>
                                            {images.map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: idx === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {p.featured && (
                                    <span className="badge" style={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        fontSize: '0.8rem',
                                        color: '#FFE66D',
                                        background: 'rgba(108, 99, 255, 0.15)',
                                        border: '1px solid var(--border-dark)',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        fontFamily: 'var(--font-mono)',
                                    }}>
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>

                            {/* Right: Quick Info */}
                            <div style={{ padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: 12, color: 'var(--text)' }}>{p.title}</h3>
                                <span className="badge" style={{
                                    fontSize: '0.8rem',
                                    color: getCategoryColor(p.projectType),
                                    background: `${getCategoryColor(p.projectType)}20`,
                                    border: '1px solid transparent',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginBottom: 14,
                                    fontFamily: 'var(--font-mono)',
                                }}>
                                    {p.projectType}
                                </span>
                                {p.role && (
                                    <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                                        <strong style={{ color: 'var(--text-light)' }}>Role:</strong> {p.role}
                                    </p>
                                )}
                                {p.startDate && p.endDate && (
                                    <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
                                        {formatDate(p.startDate)} — {formatDate(p.endDate)}
                                    </p>
                                )}
                                {p.skills && p.skills.length > 0 && (
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                                        {p.skills.map((s) => (
                                            <span key={s} className="badge" style={{
                                                fontSize: '0.75rem',
                                                color: '#8B85FF',
                                                background: 'rgba(108, 99, 255, 0.15)',
                                                border: '1px solid var(--border-dark)',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                fontFamily: 'var(--font-mono)',
                                            }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="card" style={{ marginBottom: 28, background: 'var(--card)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius)' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--primary-light)' }}>Overview</h4>
                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
                            {p.description}
                        </p>
                    </div>

                    {/* Challenges */}
                    {p.challenges && (
                        <div className="card" style={{ marginBottom: 28, background: 'var(--card)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius)' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: '#FF6B6B' }}>Challenges</h4>
                            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
                                {p.challenges}
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {p.results && (
                        <div className="card" style={{ marginBottom: 28, background: 'var(--card)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius)' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: '#00D4AA' }}>Results</h4>
                            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-light)' }}>
                                {p.results}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                        {(() => {
                            const urls = (p.projectUrls && p.projectUrls.length > 0)
                                ? p.projectUrls
                                : (p.projectUrl ? [{ label: 'Live Demo', url: p.projectUrl }] : []);
                            return urls.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{
                                        background: idx === 0
                                            ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                                            : 'var(--surface)',
                                        color: idx === 0 ? '#fff' : 'var(--text)',
                                        border: idx === 0 ? 'none' : '1px solid var(--border-dark)',
                                        padding: '10px 24px',
                                        fontSize: '0.9rem',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: idx === 0 ? '0 4px 20px rgba(108, 99, 255, 0.3)' : 'none',
                                    }}
                                >
                                    ↗ {item.label || `Link ${idx + 1}`}
                                </a>
                            ));
                        })()}
                        <Link
                            to="/team"
                            className="btn btn-secondary"
                            style={{
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                border: '1px solid var(--border-dark)',
                                padding: '10px 24px',
                                fontSize: '0.9rem',
                                borderRadius: 'var(--radius-sm)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            ← Back to Team
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
