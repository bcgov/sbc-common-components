from enum import Enum

class QueueMessageTypes(Enum):
    """Queue MessageTypes."""

    # Note some of these need to match inside of SubjectType in account_mailer.enums.

    ACCOUNT_CONFIRMATION_PERIOD_OVER = 'bc.registry.payment.confirmationPeriodOver'
    ACTIVITY_LOG = 'bc.registry.auth.activity'
    ADMIN_NOTIFICATION = 'bc.registry.auth.adminNotification'
    ADMIN_REMOVED = 'bc.registry.auth.adminRemoved'
    AFFILIATION_INVITATION = 'bc.registry.auth.affiliationInvitation'
    AFFILIATION_INVITATION_REQUEST = 'bc.registry.auth.affiliationInvitationRequest'
    AFFILIATION_INVITATION_REQUEST_AUTHORIZATION = 'bc.registry.auth.affiliationInvitationRequestAuthorization'
    BUSINESS_INVITATION = 'bc.registry.auth.businessInvitation'
    BUSINESS_INVITATION_FOR_BCEID = 'bc.registry.auth.businessInvitationForBceid'
    CAS_MESSAGE_TYPE = 'bc.registry.payment.casSettlementUploaded'
    CGI_ACK_MESSAGE_TYPE = 'bc.registry.payment.cgi.ACKReceived'
    CGI_FEEDBACK_MESSAGE_TYPE = 'bc.registry.payment.cgi.FEEDBACKReceived'
    CONFIRMATION_PERIOD_OVER = 'bc.registry.payment.confirmationPeriodOver'
    DIRSEARCH_BUSINESS_INVITATION = 'bc.registry.auth.dirsearchBusinessInvitation'
    EFT_AVAILABLE_NOTIFICATION = 'bc.registry.payment.eftAvailableNotification'
    EFT_FILE_UPLOADED = 'bc.registry.payment.eft.fileUploaded'
    EJV_FAILED = 'bc.registry.payment.ejvFailed'
    GOVM_APPROVED_NOTIFICATION = 'bc.registry.auth.govmApprovedNotification'
    GOVM_BUSINESS_INVITATION = 'bc.registry.auth.govmBusinessInvitation'
    GOVM_MEMBER_INVITATION = 'bc.registry.auth.govmMemberInvitation'
    GOVM_REJECTED_NOTIFICATION = 'bc.registry.auth.govmRejectedNotification'
    INCORPORATION = 'bc.registry.business.incorporationApplication'
    MAILER_PAYMENT_OVERPAID = 'bc.registry.payment.OverPaid'
    MAILER_PAYMENT_UNDERPAID = 'bc.registry.payment.UnderPaid'
    MEMBERSHIP_APPROVED_NOTIFICATION = 'bc.registry.auth.membershipApprovedNotification'
    MEMBERSHIP_APPROVED_NOTIFICATION_FOR_BCEID = 'bc.registry.auth.membershipApprovedNotificationForBceid'
    NAMES_EVENT = 'bc.registry.names.events'
    NAMES_MESSAGE_TYPE = 'bc.registry.names.request'
    NON_BCSC_ORG_APPROVED = 'bc.registry.auth.nonbcscOrgApprovedNotification'
    NON_BCSC_ORG_REJECTED = 'bc.registry.auth.nonbcscOrgRejectedNotification'
    NSF_LOCK_ACCOUNT = 'bc.registry.payment.lockAccount'
    NSF_UNLOCK_ACCOUNT = 'bc.registry.payment.unlockAccount'
    ONLINE_BANKING_OVER_PAYMENT = 'bc.registry.payment.OverPaid'
    ONLINE_BANKING_PAYMENT = 'bc.registry.payment.Payment'
    ONLINE_BANKING_UNDER_PAYMENT = 'bc.registry.payment.UnderPaid'
    OTP_AUTHENTICATOR_RESET_NOTIFICATION = 'bc.registry.auth.otpAuthenticatorResetNotification'
    PAD_ACCOUNT_CREATE = 'bc.registry.payment.padAccountCreate'
    PAD_INVOICE_CREATED = 'bc.registry.payment.pad.invoiceCreated'
    PAD_PAYMENT_SUCCESS = 'bc.registry.payment.PAD.PaymentSuccess'
    PAD_SETUP_FAILED = 'bc.registry.payment.PadSetupFailed'
    PAYMENT = 'bc.registry.payment'
    PAYMENT_DUE_NOTIFICATION = 'bc.registry.payment.statementDueNotification'
    PAYMENT_PENDING = 'bc.registry.payment.ob.outstandingInvoice'
    PAYMENT_REMINDER_NOTIFICATION = 'bc.registry.payment.statementReminderNotification'
    PROD_PACKAGE_APPROVED_NOTIFICATION = 'bc.registry.auth.prodPackageApprovedNotification'
    PROD_PACKAGE_REJECTED_NOTIFICATION = 'bc.registry.auth.prodPackageRejectedNotification'
    PRODUCT_APPROVED_NOTIFICATION_DETAILED = 'bc.registry.auth.productApprovedNotificationDetailed'
    PRODUCT_CONFIRMATION_NOTIFICATION = 'bc.registry.auth.productConfirmationNotification'
    PRODUCT_REJECTED_NOTIFICATION_DETAILED = 'bc.registry.auth.productRejectedNotificationDetailed'
    REFUND_DRAWDOWN_REQUEST = 'bc.registry.payment.drawdown.refundRequest'
    REGISTRATION = 'bc.registry.business.registration'
    RESET_PASSCODE = 'bc.registry.auth.resetPasscode'
    RESUBMIT_BCEID_ADMIN_NOTIFICATION = 'bc.registry.auth.resubmitBceidAdmin'
    RESUBMIT_BCEID_ORG_NOTIFICATION = 'bc.registry.auth.resubmitBceidOrg'
    ROLE_CHANGED_NOTIFICATION = 'bc.registry.auth.roleChangedNotification'
    STAFF_REVIEW_ACCOUNT = 'bc.registry.auth.staffReviewAccount'
    STATEMENT_NOTIFICATION = 'bc.registry.payment.statementNotification'
    TEAM_MEMBER_INVITED = 'bc.registry.auth.teamMemberInvited'
    TEAM_MODIFIED = 'bc.registry.auth.teamModified'
