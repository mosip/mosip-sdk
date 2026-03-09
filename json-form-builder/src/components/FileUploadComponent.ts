import { FormState, FormField, SubTypeField, FileUploadData } from "../types";
import {
    getMultiLangText,
    disableField,
    createErrorContainer,
    appendError,
    handleRequiredValidation,
    createInfoIcon,
    getLabelText,
    emptyInvalidFn,
    getAcceptString,
    mimeToLabel
} from "../utils/utils";
import { uploadIconSvg, trashIconSvg, fileIconSvg } from "../utils/icons";
import { createStringField } from "./TextInputComponent";
import { createDropdownField } from "./DropdownComponent";

/* ----------------------- Allowed File Types Text ----------------------- */
function getAllowedFileTypesText(
    allowedTypes: string[],
    maxSizeMB: number
): string {
    const uniqueTypes = Array.from(new Set(allowedTypes));
    const labels = uniqueTypes.map(mimeToLabel).filter(Boolean).join(", ");
    return `${labels} (max. ${maxSizeMB} MB)`;
}

export const createFileUploadField = (
    state: FormState,
    field: SubTypeField
): HTMLDivElement => {
    const wrapper = document.createElement("div");
    wrapper.className = `form-field file-upload ${field.cssClasses?.join(" ") || ""}`;
    wrapper.setAttribute("data-field-id", field.id);

    /* ----------------------- MAIN LABEL ----------------------- */
    const labelDiv = document.createElement("div");
    labelDiv.className = "label-div-display";

    const label = document.createElement("label");
    label.innerHTML = getLabelText(state, field);
    label.htmlFor = field.id;

    if (field.info) {
        const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
        label.appendChild(infoIcon);
    }

    labelDiv.appendChild(label);
    wrapper.appendChild(labelDiv);

    /* ----------------------- GROUP BOX ----------------------- */
    const groupBox = document.createElement("div");
    groupBox.className = "custom-group-box";

    /* ----------------------- DOCUMENT TYPE DROPDOWN ----------------------- */

    let docTypeFieldEl: HTMLDivElement | null = null;

    if (field.subType && state.allowedValues[field.subType]) {
        const docTypeField: SubTypeField = {
            ...field,
            id: `${field.id}_docType`,
            controlType: "dropdown",
            labelName: state.labels?.docType
                || { en: "Document Type" },
            placeholder: state.placeholders?.docType || { en: "Select an option" },
            subType: field.subType,
            required: true,
            disabled: field.disabled
        };
        docTypeFieldEl = createDropdownField(state, docTypeField, true);
        docTypeFieldEl.dataset.i18nLabel = "docType";
        docTypeFieldEl.dataset.i18nPlaceholder = "docType";
    }

    if (docTypeFieldEl) {
        const selectEl = (docTypeFieldEl as HTMLDivElement).querySelector("select");

        selectEl?.addEventListener("change", () => {
            state.formData[field.id] ??= {} as FileUploadData;
            (state.formData[field.id] as FileUploadData).docType = selectEl.value;
        });

    }

    /* ----------------------- REF ID FIELD ----------------------- */

    const refIdField: FormField = {
        ...field,
        id: `${field.id}_refId`,
        controlType: "textbox",
        labelName: state.labels?.docRef
            || { en: "Document Reference ID" },
        placeholder: state.placeholders?.docRef || { en: "Enter Reference ID here" },
        required: false
    };

    const refEl = createStringField(state, refIdField);
    refEl.dataset.i18nLabel = "docRef";
    refEl.dataset.i18nPlaceholder = "docRef";

    const refInputEl = refEl.querySelector("input") as HTMLInputElement;

    refInputEl?.addEventListener("input", () => {
        state.formData[field.id] ??= {} as FileUploadData;
        (state.formData[field.id] as FileUploadData).refId = refInputEl.value;
    });

    /* ----------------------- PROOF OF DOCUMENT LABEL ----------------------- */
    const podLabel = document.createElement("label");
    podLabel.dataset.i18nLabel = "proofOfDoc";
    podLabel.style.marginBottom = "4px";
    podLabel.innerHTML = getLabelText(state, {
        ...field,
        required: true,
        labelName: state.labels?.proofOfDoc
            || { en: "Proof Of Document" }
    });

    /* ----------------------- Wrap docType ----------------------- */
    if (docTypeFieldEl) {
        const docTypeWrapper = document.createElement("div");
        docTypeWrapper.className = "file-subfield";
        docTypeWrapper.dataset.subId = "docType";
        docTypeWrapper.appendChild(docTypeFieldEl);
        groupBox.appendChild(docTypeWrapper);
    }

    /* ----------------------- Wrap refId ----------------------- */
    const refWrapper = document.createElement("div");
    refWrapper.className = "file-subfield";
    refWrapper.dataset.subId = "docRef";
    refWrapper.appendChild(refEl);
    groupBox.appendChild(refWrapper);

    /* ----------------------- Wrap proofOfDoc ----------------------- */
    const podWrapper = document.createElement("div");
    podWrapper.className = "file-subfield";
    podWrapper.dataset.subId = "proofOfDoc";
    podWrapper.appendChild(podLabel);
    groupBox.appendChild(podWrapper);

    /* ----------------------- UPLOAD AREA ----------------------- */
    const allowedTypes = field.acceptedFileTypes || [];
    const isPhotoUpload = allowedTypes.every(t => t.startsWith("image/"));
    const maxSizeMB = field.maxFileSizeMB || 5;
    const maxBytes = maxSizeMB * 1024 * 1024;

    const uploadArea = document.createElement("div");
    uploadArea.className = "custom-upload-area";

    const input = document.createElement("input");
    input.type = "file";
    input.id = field.id;
    input.multiple = false;
    input.accept = getAcceptString(allowedTypes);
    input.style.display = "none";
    input.oninvalid = emptyInvalidFn(input);

    if (field.disabled) {
        disableField(input);
        uploadArea.classList.add("upload-disabled");
    }

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "icon-wrapper";
    iconWrapper.innerHTML = uploadIconSvg;
    iconWrapper.style.marginBottom = "8px";

    const text = document.createElement("div");
    text.innerHTML = `<span class="upload-text" style="color:#1B75D0; font-weight:600;">${getMultiLangText(state, state.placeholders?.proofOfDoc)}</span>`;

    const infoText = document.createElement("div");
    infoText.classList.add("file-info-text");
    infoText.style.marginTop = "6px";
    infoText.style.fontSize = "12px";
    infoText.style.color = "#666";
    infoText.textContent =
        allowedTypes.length > 0
            ? getAllowedFileTypesText(allowedTypes, maxSizeMB)
            : "Supported formats (max size applies)";

    uploadArea.appendChild(iconWrapper);
    uploadArea.appendChild(text);
    uploadArea.appendChild(infoText);

    const errorContainer = createErrorContainer();

    groupBox.appendChild(input);
    groupBox.appendChild(uploadArea);
    groupBox.appendChild(errorContainer);

    /* ----------------------- PREVIEW CONTAINER ----------------------- */
    const previewContainer = document.createElement("div");
    previewContainer.className = "upload-preview-container";

    const previewImg = document.createElement("img");
    previewImg.className = "photo-preview";
    previewImg.style.display = "none";

    const photoDeleteBtn = document.createElement("button");
    photoDeleteBtn.type = "button";
    photoDeleteBtn.className = "photo-delete-btn";
    photoDeleteBtn.innerHTML = trashIconSvg;
    photoDeleteBtn.style.display = "none";

    const previewRow = document.createElement("div");
    const previewWrapper = document.createElement("div");
    previewWrapper.style.position = "relative";

    previewWrapper.appendChild(previewImg);
    previewWrapper.appendChild(photoDeleteBtn);
    previewRow.appendChild(previewWrapper);
    previewContainer.appendChild(previewRow);

    groupBox.appendChild(previewContainer);

    photoDeleteBtn.addEventListener("click", () => {
        const existing = state.formData[field.id] as FileUploadData | undefined;

        if (existing) {
            existing.value = "";
            existing.format = "";
        }

        input.value = "";
        previewImg.src = "";
        previewImg.style.display = "none";
        photoDeleteBtn.style.display = "none";

        showUploadArea();

        // re-run form validation
        input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    wrapper.appendChild(groupBox);

    /* ----------------------- EVENTS ----------------------- */
    uploadArea.addEventListener("click", () => !field.disabled && input.click());

    uploadArea.addEventListener("dragover", e => {
        e.preventDefault();
        uploadArea.classList.add("drag-over");
    });

    uploadArea.addEventListener("dragleave", () =>
        uploadArea.classList.remove("drag-over")
    );

    uploadArea.addEventListener("drop", async e => {
        e.preventDefault();
        uploadArea.classList.remove("drag-over");
        if (field.disabled) return;
        const files = e.dataTransfer?.files;
        if (!files || files.length === 0) return;

        await processFiles(files);
    });

    input.addEventListener("change", async e => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;
        await processFiles(files);
    });

    /* ----------------------- PROCESS FILES – SINGLE OBJECT ----------------------- */
    async function processFiles(files: FileList) {
        appendError(errorContainer, "");

        const file = files[0];

        /* Validation */
        if (field.required && !file) {
            const result = handleRequiredValidation(state, errorContainer);
            state.lastErrors![field.id] = result.lastError;
            return;
        }

        // corrupted / empty file
        if (!file || file.size === 0) {
            appendError(errorContainer, "File appears to be corrupted or empty");
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            appendError(errorContainer, `Unsupported file type: ${file.name}`);
            return;
        }

        if (file.size > maxBytes) {
            appendError(errorContainer, `File too large (${file.name}). Maximum size is ${maxSizeMB} MB`);
            return;
        }

        state.formData[field.id] ??= {} as FileUploadData;

        const fileData = state.formData[field.id] as FileUploadData;
        fileData.value = file;
        fileData.format = file.type;

        input.value = "";

        /* Render preview */
        hideUploadArea();

        input.dispatchEvent(new Event("change", { bubbles: true }));

        if (isPhotoUpload) {
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = "block";
            photoDeleteBtn.style.display = "block";
        } else {
            renderFilePreview(file.name, file.size);
        }
    }

    /* ----------------------- FILE PREVIEW FOR NON-PHOTO ----------------------- */
    function renderFilePreview(fileName: string, fileSize: number) {
        previewWrapper.innerHTML = ""; // clear
        previewImg.style.display = "none";
        photoDeleteBtn.style.display = "none";

        const fileRow = document.createElement("div");
        fileRow.className = "uploaded-file-item";

        const left = document.createElement("div");
        left.className = "file-preview-left";

        const icon = document.createElement("div");
        icon.className = "file-icon";
        icon.innerHTML = fileIconSvg;

        const meta = document.createElement("div");
        meta.className = "file-meta";

        const nameDiv = document.createElement("div");
        nameDiv.className = "file-name";
        nameDiv.textContent = fileName;

        const sizeDiv = document.createElement("div");
        sizeDiv.className = "file-size";
        sizeDiv.textContent = `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;

        meta.appendChild(nameDiv);
        meta.appendChild(sizeDiv);
        left.appendChild(icon);
        left.appendChild(meta);

        const delBtn = document.createElement("button");
        delBtn.className = "file-delete-btn";
        delBtn.innerHTML = trashIconSvg;

        delBtn.addEventListener("click", () => {
            const existing = state.formData[field.id] as FileUploadData | undefined;

            if (existing) {
                existing.value = "";
                existing.format = "";
            }

            input.value = "";
            previewWrapper.innerHTML = "";
            showUploadArea();

            // re-run form validation
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });

        fileRow.appendChild(left);
        fileRow.appendChild(delBtn);
        previewWrapper.appendChild(fileRow);
    }

    /* ----------------------- HELPERS ----------------------- */
    function hideUploadArea() {
        uploadArea.style.display = "none";
    }

    function showUploadArea() {
        uploadArea.style.display = "block";
    }

    return wrapper;
};
