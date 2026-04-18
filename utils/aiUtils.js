module.exports = {
    autoCategory(title) {
        const map = {
            Programming: ['react', 'javascript', 'typescript', 'python', 'bug',
                'code', 'css', 'node', 'api', 'html', 'database', 'error', 'js', 'git'],
            Design: ['ui', 'ux', 'figma', 'design', 'color', 'layout', 'logo', 'wireframe'],
            Math: ['math', 'calculus', 'algebra', 'equation', 'statistics', 'geometry'],
            Science: ['physics', 'chemistry', 'biology', 'science', 'lab', 'experiment'],
            Language: ['english', 'grammar', 'essay', 'writing', 'urdu', 'arabic']
        };
        const lower = title.toLowerCase();
        for (const [cat, keywords] of Object.entries(map)) {
            if (keywords.some(kw => lower.includes(kw))) return cat;
        }
        return 'Other';
    },

    detectUrgency(description) {
        const lower = description.toLowerCase();
        const high = ['urgent', 'asap', 'immediately', 'deadline',
            'exam tomorrow', 'help now', 'critical', 'emergency'];
        const medium = ['soon', 'by tomorrow', 'need this', 'this week', 'quickly'];
        if (high.some(w => lower.includes(w))) return 'high';
        if (medium.some(w => lower.includes(w))) return 'medium';
        return 'low';
    },

    generateSummary(description) {
        return description.split(/[.!?]/).slice(0, 2).join('. ').trim() + '.';
    }
};