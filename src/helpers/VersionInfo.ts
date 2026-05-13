import { LIB_VERSION } from '../version';

interface AppVersionInfo {
    app: string;
    commit: string;
    buildDate: string;
}

interface FullVersionInfo extends AppVersionInfo {
    lib: string;
}

declare global {
    interface Window {
        __VERSIONS__: FullVersionInfo;
    }
}

const showToast = (info: FullVersionInfo): void => {
    const existing = document.getElementById('mb-version-toast');
    if (existing) {
        existing.remove();
        return;
    }
    const el = document.createElement('div');
    el.id = 'mb-version-toast';
    el.style.cssText = [
        'position:fixed',
        'bottom:16px',
        'right:16px',
        'z-index:2147483647',
        'background:rgba(0,0,0,0.88)',
        'color:#fff',
        'padding:12px 16px',
        'border-radius:8px',
        'font:12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
        'box-shadow:0 4px 16px rgba(0,0,0,0.35)',
        'pointer-events:none',
    ].join(';');
    el.textContent = `app ${info.app} (${info.commit}) · lib ${info.lib} · built ${info.buildDate}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
};

export const initVersionInfo = (appInfo: AppVersionInfo): void => {
    const versions: FullVersionInfo = { ...appInfo, lib: LIB_VERSION };
    window.__VERSIONS__ = versions;
    console.info(
        `%c build %c app ${versions.app} (${versions.commit}) · lib ${versions.lib} · ${versions.buildDate} `,
        'background:#222;color:#0f0;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:bold',
        'background:#333;color:#eee;padding:2px 6px;border-radius:0 3px 3px 0'
    );
    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.altKey && (e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
            showToast(versions);
        }
    });
};
