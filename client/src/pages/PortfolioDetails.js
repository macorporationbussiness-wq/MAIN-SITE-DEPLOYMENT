import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import PageHeader from '../components/PageHeader';

export default function PortfolioDetails() {
    const { slug } = useParams();
    const [p, setP] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getImages = (portfolio) => {
        if (portfolio?.projectImages && portfolio.projectImages.length > 0) {
            return portfolio.projectImages;
        }
        return portfolio?.projectImage ? [portfolio.projectImage] : [];
    };

    const nextImage = () => {
        const imgs = getImages(p);
        if (imgs.length > 1) {
            setCurrentImageIndex((i) => (i + 1) % imgs.length);
        }
    };

    const prevImage = () => {
        const imgs = getImages(p);
        if (imgs.length > 1) {
            setCurrentImageIndex((i) => (i - 1 + imgs.length) % imgs.length);
        }
    };

    useEffect(() => {
        setP(null);
        setLoading(true);
        setCurrentImageIndex(0);
        API.get(`/portfolios/${slug}`)
            .then((r) => setP(r.data || null))
            .catch(() => setP(null))
            .finally(() => setLoading(false));
    }, [slug]);

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
        if (!name) return '📁';
        return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div>
                <PageHeader eyebrow="PROJECTS" title="Loading…" subtitle="Fetching project details…" />
                <section className="section-dark" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
                    <div className="container">
                        <p className="muted text-center">Loading project details…</p>
                    </div>
                </section>
            </div>
        );
    }

    if (!p) {
        return (
            <div>
                <PageHeader eyebrow="PROJECTS" title="Not Found" subtitle="The project you are looking for does not exist." />
                <section className="section-dark" style={{ padding: '40px 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <Link to="/portfolios" className="btn btn-primary">
                            Back to All Projects
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="PORTFOLIO"
                title={p.title}
                subtitle={p.teamMember ? `${p.teamMember.name} — ${p.teamMember.position}` : (p.teamMemberName || '')}
            />

            <section className="section-dark" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
                <div className="container">
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
                                    const images = getImages(p);
                                    return images.length > 0 ? (
                                        <img
                                            key={currentImageIndex}
                                            src={images[currentImageIndex]}
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
                                {getImages(p).length > 1 && (
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
                                            {getImages(p).map((_, idx) => (
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
                                        Featured
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

                    {/* Team Member Info */}
                    {(p.teamMember || p.teamMemberName) && (
                        <div className="card" style={{ marginBottom: 28, background: 'var(--card)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius)' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: 14, color: 'var(--primary-light)' }}>Team Member</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div
                                    style={{
                                        width: 56, height: 56, borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${getCategoryColor(p.projectType)}, ${getCategoryColor(p.projectType)}99)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, color: '#fff', fontSize: '1.4rem',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    {initials(p.teamMember?.name || p.teamMemberName)}
                                </div>
                                <div>
                                    <h5 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--text)' }}>{p.teamMember?.name || p.teamMemberName}</h5>
                                    {p.teamMember?.position && (
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                                            {p.teamMember.position}
                                        </p>
                                    )}
                                </div>
                            </div>
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
                            to="/portfolios"
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
                            ← Back to All Projects
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
