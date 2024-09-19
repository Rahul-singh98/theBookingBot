from typing import Dict, AnyStr


class Pagination:

    @staticmethod
    def get_offset(page: int, per_page_count: int) -> int:
        """Calculate offset of page"""
        offset = max((page - 1) * per_page_count, 0)
        return offset

    @staticmethod
    def paginate(total_records: int, per_page_count: int, page: int) -> Dict[AnyStr, int]:
        """
        Calculates pagination details for a search result.

        This static method takes the total number of records, records per page, and current page number
        and returns a dictionary containing pagination information such as total records, records per page,
        current page, total pages, start record index, and end record index.

        Args:
            total_records (int): Total number of records in the search result.
            per_page_count (int): Number of records to be displayed per page.
            page (int): Current page number (starts from 1).

        Returns:
            Dict[AnyStr, int]: A dictionary containing pagination details.
        """
        # Calculate total pages
        total_pages = (total_records + per_page_count - 1) // per_page_count

        # Ensure current page is within valid range
        if page < 1:
            page = 1
        elif page > total_pages:
            page = total_pages

        # Calculate the start and end record indices
        start_record = max((page - 1) * per_page_count, 0)
        end_record = min(start_record + per_page_count, total_records)

        # Create pagination object
        pagination = {
            "total_records": total_records,
            "per_page_count": per_page_count,
            "current_page": page,
            "total_pages": total_pages,
            "start_record": start_record,
            "end_record": end_record
        }

        return pagination
