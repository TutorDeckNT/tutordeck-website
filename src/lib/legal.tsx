// src/lib/legal.tsx

import React from 'react';

export interface LegalSectionData {
    id: string;
    title: string;
    content: React.ReactNode;
}

export interface LegalDocumentData {
    title: string;
    version: string;
    lastUpdated: string;
    intro?: React.ReactNode;
    sections: LegalSectionData[];
}

export const termsOfServiceData: LegalDocumentData = {
    title: "Terms of Service",
    version: "v2025.10.26",
    lastUpdated: "October 26, 2025",
    intro: (
        <p className="mb-6 text-gray-400 text-lg leading-relaxed">
            Please read these terms carefully before using the TutorDeck platform.
            Accessing our services implies full agreement to these conditions.
        </p>
    ),
    sections: [
        {
            id: "acceptance",
            title: "1. Acceptance of Terms",
            content: <p>By accessing or using the TutorDeck platform and its services, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you may not use our services.</p>
        },
        {
            id: "conduct",
            title: "2. User Conduct",
            content: (
                <>
                    <p className="mb-4">You agree to use TutorDeck's services for their intended educational and community service purposes. You are solely responsible for your conduct and any data you submit.</p>
                    <p className="mb-2 text-primary font-semibold">Prohibited Actions:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
                        <li><strong>Falsification of Information:</strong> Intentionally submitting false, inaccurate, or misleading information, including but not limited to, faking volunteer hours, misrepresenting tutoring sessions, or providing fraudulent proof of activity.</li>
                        <li><strong>Academic Dishonesty:</strong> Completing assignments, writing essays, taking tests, or otherwise doing work on behalf of a student. The role of a tutor is to guide and support, not to commit academic fraud.</li>
                        <li><strong>Harassment and Abuse:</strong> Engaging in any form of harassment, bullying, discrimination, or threatening behavior towards any user.</li>
                        <li><strong>Unlawful Activities:</strong> Using the service for any illegal or unauthorized purpose.</li>
                    </ul>
                </>
            )
        },
        {
            id: "verification",
            title: "3. Verification & Enforcement",
            content: (
                <>
                    <p className="mb-4">TutorDeck is built on a foundation of trust and integrity. We take the accuracy of volunteer hours very seriously as they are a reflection of our community's impact.</p>
                    <p className="mb-4">We reserve the right, at our sole discretion, to audit, investigate, and verify any volunteer hours or activities logged on our platform. If an activity is found to be fraudulent, falsified, or in violation of these Terms, we may take actions including, but not limited to:</p>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-200 text-sm">
                        <ul className="list-disc list-inside space-y-1">
                            <li>Permanent removal of the fraudulent hours from your record.</li>
                            <li>Issuing a formal warning.</li>
                            <li>Temporary suspension of your account.</li>
                            <li>Permanent termination of your account and a ban from all future TutorDeck activities.</li>
                        </ul>
                    </div>
                </>
            )
        },
        {
            id: "termination",
            title: "4. Termination",
            content: <p>We reserve the right to suspend or terminate your access to our services at any time, without notice, for any reason, including for a breach of these Terms.</p>
        },
        {
            id: "disclaimer",
            title: "5. Disclaimer of Warranties",
            content: <p>The TutorDeck service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee any specific academic outcomes or results from using our services.</p>
        }
    ]
};

export const privacyPolicyData: LegalDocumentData = {
    title: "Privacy Policy",
    version: "v2025.10.26",
    lastUpdated: "October 26, 2025",
    intro: (
        <p className="mb-6 text-gray-400 text-lg leading-relaxed">
            This Privacy Policy describes how TutorDeck ("we," "us," or "our") collects, uses, and shares information about you when you use our website, services, and platform.
        </p>
    ),
    sections: [
        {
            id: "collection",
            title: "1. Information We Collect",
            content: (
                <>
                    <p className="mb-4">We collect information to provide and improve our services. The types of information we may collect include:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
                        <li><strong>Personal Information You Provide:</strong> This includes your name, email address, school, and any other information you provide when you create an account or communicate with us.</li>
                        <li><strong>Volunteer Activity Data:</strong> We collect all data related to your volunteer activities, such as activity type, date, duration (hours), and any proof or verification links you submit.</li>
                        <li><strong>Usage Information:</strong> We automatically collect information about your interactions with our services, such as your IP address, browser type, device information, and pages visited.</li>
                    </ul>
                </>
            )
        },
        {
            id: "usage",
            title: "2. How We Use Information",
            content: (
                <>
                    <p className="mb-4">We may use the information we collect for a wide range of purposes, at our discretion, to operate and grow our initiative. These purposes include, but are not limited to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
                        <li>To operate, maintain, and provide the features of our service.</li>
                        <li>To communicate with you regarding service-related announcements.</li>
                        <li>To monitor and analyze trends and usage.</li>
                        <li><strong>For Research:</strong> We may use aggregated data for statistical analysis, academic research, and impact reporting.</li>
                        <li><strong>For Promotion:</strong> We may use aggregated data and testimonials to promote our organization and for fundraising efforts.</li>
                        <li>To enforce our Terms of Service and prevent fraud.</li>
                    </ul>
                </>
            )
        },
        {
            id: "sharing",
            title: "3. Sharing Information",
            content: (
                <>
                    <p className="mb-4">We may share your information in the following circumstances:</p>
                     <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
                        <li>With third-party vendors (e.g., cloud hosting) who need access to such information to carry out work on our behalf.</li>
                        <li>We may share aggregated, anonymized data publicly and with partners.</li>
                        <li>In response to a legal request if we believe disclosure is required by law.</li>
                        <li>To protect the rights, property, and safety of TutorDeck or others.</li>
                    </ul>
                </>
            )
        },
        {
            id: "consent",
            title: "4. Your Consent",
            content: <p>By using our services, you consent to the collection, use, processing, and sharing of your information as described in this Privacy Policy. You acknowledge that our use of data, including for statistical and promotional purposes, is essential to the operation and mission of our non-profit initiative.</p>
        }
    ]
};
