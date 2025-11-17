/*
 * script.js - Mockup editor for PreviewFast
 * Rewritten cleanly to restore editor and export functionality.
 */

class MockupEditor {
    constructor() {
        // Editor elements
        this.editorPanel = document.getElementById('editorPanel');
        this.textEditor = document.getElementById('textEditor');
        this.imageEditor = document.getElementById('imageEditor');
        this.logoEditor = document.getElementById('logoEditor');
        this.subtitleEditor = document.getElementById('subtitleEditor');
        this.globalDownloadBtn = document.getElementById('downloadWorkedDesignBtn');
    this.optionsSelectorGroup = document.getElementById('optionsSelectorGroup');
    this.optionsSelector = document.getElementById('optionsSelector');

        // Background controls
        this.backgroundGroup = document.getElementById('backgroundEditorGroup');
        this.backgroundModeButtons = document.querySelectorAll('.bg-mode-btn');
        this.backgroundSolidGroup = document.getElementById('backgroundSolidGroup');
        this.gradientPickerGroup = document.getElementById('gradientPickerGroup');
        this.gradientPresetGroup = document.getElementById('gradientPresetGroup');
        this.backgroundImageGroup = document.getElementById('backgroundImageGroup');
        this.bgSolidColor = document.getElementById('bgSolidColor');
        this.bgColor1 = document.getElementById('bgColor1');
        this.bgColor2 = document.getElementById('bgColor2');
        this.bgImageInput = document.getElementById('bgImageInput');
    this.bgImageUploadBtn = document.getElementById('bgImageUploadBtn');

        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.uploadLogoBtn = document.getElementById('uploadLogoBtn');

        // state
        this.currentElement = null;
        this.currentType = null; // text, image, bgimage, background, logo, subtitle, etc.
        this.backgroundMode = 'gradient';
        this.lastEditedDesignId = null;
        this.lastEditedDesignName = null;
    this.currentOptions = [];
    this.activeOptionIndex = null;

        this.makeElementsEditable();
        this.initEditTools();
        this.attachEventListeners();
        this.updateGlobalDownloadButton();
    }

    makeElementsEditable() {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEditor(el);
            });
        });
    }

    initEditTools() {
        // single options button per card
        const optionButtons = document.querySelectorAll('.options-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = btn.closest('.card');
                if (!card) return;
                this.openOptionsForCard(card);
            });
        });

        // download buttons
        const downloadButtons = document.querySelectorAll('.download-design-btn');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const designId = btn.getAttribute('data-design');
                await this.downloadDesign(designId, btn);
            });
        });
    }

    openOptionsForCard(card) {
        if (!card) return;
        const options = this.buildOptionsForCard(card);
        if (!options.length) {
            this.showNotification('Aucune option disponible pour cet écran.', 'error');
            return;
        }

        this.updateOptionsSelector(options);
        this.markDesignAsActiveFromElement(card);
        this.activateOption(0);
    }

    buildOptionsForCard(card) {
        const elements = card.querySelectorAll('[data-editable]');
        return Array.from(elements).map((element, index) => {
            const type = element.getAttribute('data-editable');
            return {
                element,
                type,
                index,
                label: element.dataset.optionLabel || this.getOptionLabel(type, element),
                preferredMode: element.dataset.backgroundType || null
            };
        });
    }

    getOptionLabel(type, element) {
        const defaults = {
            text: 'Texte',
            title: 'Titre',
            subtitle: 'Sous-titre',
            image: 'Visuel',
            bgimage: 'Fond image',
            background: 'Fond',
            gradient: 'Dégradé',
            logo: 'Logo'
        };
        if (defaults[type]) return defaults[type];
        if (element?.tagName === 'IMG') return 'Image';
        return 'Option';
    }

    updateOptionsSelector(options) {
        if (!this.optionsSelector || !this.optionsSelectorGroup) return;
        this.currentOptions = options;
        this.activeOptionIndex = null;
        this.optionsSelector.innerHTML = '';

        if (!options.length) {
            this.optionsSelectorGroup.style.display = 'none';
            return;
        }

        this.optionsSelectorGroup.style.display = 'flex';
        options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'option-pill';
            btn.textContent = option.label || `Option ${index + 1}`;
            btn.addEventListener('click', () => this.activateOption(index));
            option.button = btn;
            this.optionsSelector.appendChild(btn);
        });
    }

    activateOption(index) {
        if (!this.currentOptions || !this.currentOptions.length) return;
        const option = this.currentOptions[index];
        if (!option) return;

        this.activeOptionIndex = index;
        this.currentOptions.forEach((opt, i) => {
            if (opt.button) opt.button.classList.toggle('active', i === index);
        });

        const mode = option.preferredMode || undefined;
        this.openEditor(option.element, { keepOptions: true, mode });
    }

    attachEventListeners() {
        if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveChanges());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeEditor());
        if (this.uploadBtn) this.uploadBtn.addEventListener('click', () => this.handleUpload());
        if (this.uploadLogoBtn) this.uploadLogoBtn.addEventListener('click', () => this.handleLogoUpload());
        if (this.bgImageUploadBtn) this.bgImageUploadBtn.addEventListener('click', () => this.handleBackgroundUpload());

        // background mode buttons
        if (this.backgroundModeButtons) {
            this.backgroundModeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const mode = btn.getAttribute('data-mode') || 'gradient';
                    this.setBackgroundMode(mode);
                });
            });
        }

        // preset colors
        const presetButtons = document.querySelectorAll('.preset-color');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const colors = (btn.getAttribute('data-colors') || '').split(',');
                if (this.bgColor1) this.bgColor1.value = colors[0] || this.bgColor1.value;
                if (this.bgColor2) this.bgColor2.value = colors[1] || colors[0] || this.bgColor2.value;
                this.setBackgroundMode('gradient');
            });
        });

        // close editor when clicking outside
        document.addEventListener('click', (e) => {
            if (this.editorPanel && this.editorPanel.style.display === 'block') {
                if (!this.editorPanel.contains(e.target) && this.currentElement && !this.currentElement.contains(e.target)) {
                    this.closeEditor();
                }
            }
        });

        // keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editorPanel && this.editorPanel.style.display === 'block') this.closeEditor();
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.editorPanel && this.editorPanel.style.display === 'block') {
                e.preventDefault();
                this.saveChanges();
            }
        });

        if (this.globalDownloadBtn) {
            this.globalDownloadBtn.addEventListener('click', async () => {
                if (!this.lastEditedDesignId) {
                    this.showNotification('Commencez par personnaliser un design pour l\'exporter.', 'error');
                    return;
                }
                await this.downloadDesign(this.lastEditedDesignId, this.globalDownloadBtn);
            });
        }
    }

    markDesignAsActiveFromElement(element) {
        if (!element) return;
        const section = element.closest('.design-section');
        if (!section) return;
        const designId = section.dataset.design;
        if (!designId) return;
        this.lastEditedDesignId = designId;
        this.lastEditedDesignName = section.dataset.designName || `design-${designId}`;
        this.updateGlobalDownloadButton();
    }

    updateGlobalDownloadButton() {
        if (!this.globalDownloadBtn) return;
        if (this.lastEditedDesignId) {
            const label = this.formatDesignLabel();
            this.globalDownloadBtn.disabled = false;
            this.globalDownloadBtn.textContent = `Télécharger ${label}`;
        } else {
            this.globalDownloadBtn.disabled = true;
            this.globalDownloadBtn.textContent = 'Télécharger mon design';
        }
    }

    formatDesignLabel() {
        if (this.lastEditedDesignName) {
            return this.lastEditedDesignName
                .replace(/[-_]+/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());
        }
        return `Design ${this.lastEditedDesignId || ''}`.trim();
    }

    openEditor(element, options = {}) {
        if (!element) return;
        this.currentElement = element;
    this.currentType = element.getAttribute('data-editable') || 'background';
    this.markDesignAsActiveFromElement(element);
    if (!options.keepOptions) this.updateOptionsSelector([]);

        // Populate common controls
        if (this.currentType === 'text' || this.currentType === 'title') {
            if (this.textEditor) {
                this.textEditor.value = element.innerHTML.replace(/<br>/g, '\n');
                this.textEditor.style.display = 'block';
                this.textEditor.parentElement.style.display = 'flex';
            }
        }

        if (this.currentType === 'image' || this.currentType === 'bgimage') {
            if (this.imageEditor) {
                this.imageEditor.value = element.src || '';
                this.imageEditor.parentElement.style.display = 'flex';
            }
        }

        if (this.currentType === 'logo') {
            if (this.logoEditor) {
                this.logoEditor.value = element.src || '';
                this.logoEditor.parentElement.style.display = 'flex';
            }
        }

        if (this.currentType === 'subtitle') {
            if (this.subtitleEditor) {
                this.subtitleEditor.value = element.textContent || '';
                this.subtitleEditor.parentElement.style.display = 'flex';
            }
        }

        // Background-specific
        if (this.currentType === 'background' || this.currentType === 'gradient') {
            const preferredMode = options.mode || this.detectBackgroundMode(element);
            this.setBackgroundMode(preferredMode || 'gradient', true);
            this.populateBackgroundControls(element);
            if (this.backgroundGroup) this.backgroundGroup.style.display = 'flex';
        }

        // Show panel
        if (this.editorPanel) this.editorPanel.style.display = 'block';
    }

    closeEditor() {
        if (this.editorPanel) this.editorPanel.style.display = 'none';
        this.hideAllEditorControls();
        this.currentElement = null;
        this.currentType = null;
    }

    hideAllEditorControls() {
        const groups = [
            this.textEditor ? this.textEditor.parentElement : null,
            this.imageEditor ? this.imageEditor.parentElement : null,
            this.logoEditor ? this.logoEditor.parentElement : null,
            this.subtitleEditor ? this.subtitleEditor.parentElement : null,
            this.backgroundGroup || null,
            this.optionsSelectorGroup || null
        ];
        groups.forEach(g => { if (g) g.style.display = 'none'; });
    }

    detectBackgroundMode(element) {
        if (!element) return 'gradient';
        const stored = element.dataset.backgroundType;
        if (stored) return stored;
        const computed = window.getComputedStyle(element);
        const bgImage = computed.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            if (bgImage.includes('url')) return 'image';
            if (bgImage.includes('gradient')) return 'gradient';
        }
        const bgColor = computed.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') return 'color';
        return 'gradient';
    }

    setBackgroundMode(mode, skipPopulate = false) {
        if (!mode) mode = 'gradient';
        this.backgroundMode = mode;
        if (this.backgroundModeButtons) {
            this.backgroundModeButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-mode') === mode));
        }
        if (this.backgroundSolidGroup) this.backgroundSolidGroup.style.display = mode === 'color' ? 'flex' : 'none';
        if (this.gradientPickerGroup) this.gradientPickerGroup.style.display = mode === 'gradient' ? 'grid' : 'none';
        if (this.gradientPresetGroup) this.gradientPresetGroup.style.display = mode === 'gradient' ? 'flex' : 'none';
        if (this.backgroundImageGroup) this.backgroundImageGroup.style.display = mode === 'image' ? 'flex' : 'none';
        if (!skipPopulate && this.currentElement) this.populateBackgroundControls(this.currentElement);
    }

    populateBackgroundControls(element) {
        if (!element) return;
        const computed = window.getComputedStyle(element);
        const bgImage = computed.backgroundImage;
        const bgColor = computed.backgroundColor;

        if (bgImage && bgImage !== 'none') {
            const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
            if (urlMatch && urlMatch[1] && this.bgImageInput) this.bgImageInput.value = urlMatch[1];
            if (bgImage.includes('gradient')) {
                const rgbMatch = bgImage.match(/rgb\([^)]*\)/g) || [];
                if (rgbMatch.length >= 2) {
                    if (this.bgColor1) this.bgColor1.value = this.rgbToHex(rgbMatch[0]);
                    if (this.bgColor2) this.bgColor2.value = this.rgbToHex(rgbMatch[1]);
                }
            }
        } else if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            if (this.bgSolidColor) this.bgSolidColor.value = this.rgbToHex(bgColor);
        }
    }

    rgbToHex(rgb) {
        if (!rgb) return '#667eea';
        const m = rgb.match(/\d+/g);
        if (!m || m.length < 3) return '#667eea';
        const [r, g, b] = m.map(x => parseInt(x, 10));
        return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    }

    async saveChanges() {
        if (!this.currentElement) return;

        if (this.currentType === 'text' || this.currentType === 'title') {
            const newText = this.textEditor.value.replace(/\n/g, '<br>');
            this.currentElement.innerHTML = newText;
        } else if (this.currentType === 'image' || this.currentType === 'bgimage') {
            const newUrl = this.imageEditor.value.trim();
            if (newUrl) this.currentElement.src = newUrl;
        } else if (this.currentType === 'logo') {
            const newUrl = this.logoEditor.value.trim();
            if (newUrl) this.currentElement.src = newUrl;
        } else if (this.currentType === 'subtitle') {
            this.currentElement.textContent = this.subtitleEditor.value;
        } else if (this.currentType === 'background' || this.currentType === 'gradient') {
            const mode = this.backgroundMode || this.detectBackgroundMode(this.currentElement);
            if (mode === 'image') {
                const url = this.bgImageInput ? this.bgImageInput.value.trim() : '';
                if (!url) { this.showNotification('Merci de saisir une URL d\'image valide.', 'error'); return; }
                this.currentElement.style.background = 'none';
                this.currentElement.style.backgroundImage = `url("${url}")`;
                this.currentElement.style.backgroundSize = 'cover';
                this.currentElement.style.backgroundPosition = 'center';
                this.currentElement.style.backgroundRepeat = 'no-repeat';
                this.currentElement.dataset.backgroundType = 'image';
            } else if (mode === 'color') {
                const c = this.bgSolidColor ? this.bgSolidColor.value : '#667eea';
                this.currentElement.style.backgroundImage = 'none';
                this.currentElement.style.background = c;
                this.currentElement.dataset.backgroundType = 'color';
            } else { // gradient
                const c1 = this.bgColor1 ? this.bgColor1.value : '#667eea';
                const c2 = this.bgColor2 ? this.bgColor2.value : c1;
                this.currentElement.style.background = `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`;
                this.currentElement.dataset.backgroundType = 'gradient';
            }
        }

        this.showNotification('Modifications sauvegardées !', 'success');
        this.closeEditor();
    }

    handleUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { if (this.imageEditor) this.imageEditor.value = ev.target.result; };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    handleLogoUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { if (this.logoEditor) this.logoEditor.value = ev.target.result; };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    handleBackgroundUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { if (this.bgImageInput) this.bgImageInput.value = ev.target.result; };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    setDownloadButtonState(button, isLoading) {
        if (!button) return;
        if (isLoading) {
            if (!button.dataset.originalText) button.dataset.originalText = button.textContent.trim();
            button.textContent = 'Préparation...';
            button.disabled = true;
            button.classList.add('loading');
        } else {
            const original = button.dataset.originalText;
            if (original) button.textContent = original;
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    async downloadDesign(designId, triggerBtn) {
        if (!designId) return;
        if (typeof html2canvas !== 'function' || typeof JSZip !== 'function') {
            this.showNotification("La generation d'export est indisponible.", 'error');
            return;
        }

        const designSection = document.querySelector(`.design-section[data-design="${designId}"]`);
        if (!designSection) { this.showNotification('Design introuvable.', 'error'); return; }

        const cards = Array.from(designSection.querySelectorAll('.card'));
        if (!cards.length) { this.showNotification('Aucun écran à exporter pour ce design.', 'error'); return; }

        this.setDownloadButtonState(triggerBtn, true);

        const cardsToExport = cards.slice(0, 5);
        if (cardsToExport.length < 5) {
            this.showNotification('Ce design doit contenir 5 écrans pour être exporté.', 'error');
            this.setDownloadButtonState(triggerBtn, false);
            return;
        }

        // Hide overlays before capture
        const overlays = document.querySelectorAll('.card-tools');
        const hidden = [];
        overlays.forEach(o => { hidden.push({ el: o, v: o.style.visibility }); o.style.visibility = 'hidden'; });

        try {
            const zip = new JSZip();
            const designSlug = designSection.dataset.designName || `design-${designId}`;
            const captures = await Promise.all(cardsToExport.map((card, i) => this.captureCard(card, i, designSlug)));
            captures.forEach(c => zip.file(c.filename, c.data, { base64: true }));
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${designSlug}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            this.showNotification('Design téléchargé !', 'success');
        } catch (err) {
            console.error('Download error', err);
            this.showNotification('Erreur lors du téléchargement du design.', 'error');
        } finally {
            hidden.forEach(h => { if (h.v === undefined || h.v === '') h.el.style.removeProperty('visibility'); else h.el.style.visibility = h.v; });
            this.setDownloadButtonState(triggerBtn, false);
        }
    }

    async captureCard(card, index, designSlug) {
        // temporarily remove elements that shouldn't appear in the capture
    const toHide = card.querySelectorAll('.options-btn, .card-tools');
        const hidden = [];
        toHide.forEach(el => { hidden.push({ el, v: el.style.visibility }); el.style.visibility = 'hidden'; });

        // use a reasonable scale for better quality
        const scale = Math.max(2, window.devicePixelRatio || 1);
        const canvas = await html2canvas(card, { backgroundColor: null, scale });

        // restore
        hidden.forEach(h => { if (h.v === undefined || h.v === '') h.el.style.removeProperty('visibility'); else h.el.style.visibility = h.v; });

        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        const filename = `${designSlug}-screen-${String(index + 1).padStart(2, '0')}.png`;
        return { filename, data: base64 };
    }

    showNotification(message, type = 'success') {
        const n = document.createElement('div');
        n.textContent = message;
        n.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 18px;border-radius:8px;color:#fff;z-index:11000;box-shadow:0 10px 30px rgba(0,0,0,.3);background:${type==='success'? '#10b981' : '#ef4444'};`;
        document.body.appendChild(n);
        setTimeout(() => { n.style.transition = 'opacity .3s'; n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const editor = new MockupEditor();
    window.mockupEditor = editor;
    console.log('🚀 PreviewFast initialized!');
});
