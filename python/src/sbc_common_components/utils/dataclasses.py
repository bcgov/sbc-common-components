from dataclasses import asdict, dataclass
from typing import Optional


@dataclass
class PaymentToken:
    """Payment Token payload common interface for LEAR and Names."""

    id: Optional[str] = None
    status_code: Optional[str] = None
    filing_identifier: Optional[str] = None
    corp_type_code: Optional[str] = None
