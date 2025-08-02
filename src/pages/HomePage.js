import React, { useState } from 'react';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [longUrl, setLongUrl] = useState("");
    const [validityPeriod, setValidityPeriod] = useState("");
    const [customShortcode, setCustomShortcode] = useState("");
    const [error, setError] = useState("");
    const [shortenedUrls, setShortenedUrls] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!longUrl) {
            setError("Please enter a valid URL");
            return;
        }
        if (customShortcode && customShortcode.length < 3) {
            setError("Custom shortcode must be at least 3 characters long");
            return;
        }

        let shortcode = customShortcode;
        if (!shortcode) {
            shortcode = Math.random().toString(36).substring(2, 8);
        }

        if (shortenedUrls.some(url => url.customShortcode === shortcode)) {
            setError("Custom shortcode already exists. Please choose a different one.");
            return;
        }
        if (shortenedUrls.some(url => url.longUrl === longUrl)) {
            setError("This URL has already been shortened.");
            return;
        }

        const period = validityPeriod ? parseInt(validityPeriod, 10) : 30;
        const newUrl = {
            longUrl,
            validityPeriod: period,
            customShortcode: shortcode,
            expireTime: new Date(Date.now() + period * 60000).toISOString()
        };

        setShortenedUrls([...shortenedUrls, newUrl]);
        setLongUrl("");
        setValidityPeriod("");
        setCustomShortcode("");
        setError("");
    };

    return (
        <div>
            <h1>Welcome to URL Shortener</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={longUrl}
                    placeholder='Enter long URL'
                    onChange={(e) => setLongUrl(e.target.value)}
                    required
                />
                <input
                    type='number'
                    value={validityPeriod}
                    placeholder='Enter validity period (in minutes) Default 30'
                    onChange={(e) => setValidityPeriod(e.target.value)}
                    min="1"
                />
                <input
                    type='text'
                    value={customShortcode}
                    placeholder='Enter custom shortcode (optional)'
                    onChange={(e) => setCustomShortcode(e.target.value)}
                />
                <button type='submit'>Shorten URL</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Shortened URLs</h2>
            <ul>
                {shortenedUrls.map((url, index) => (
                    <li key={index}>
                        <p
                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            onClick={() => window.open(url.longUrl, '_blank')}
                        >
                            Short URL: {`https://short.url/${url.customShortcode}`}
                        </p>
                        <p>Validity Period: {url.validityPeriod} minutes</p>
                        <p>Expires at: {new Date(url.expireTime).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
