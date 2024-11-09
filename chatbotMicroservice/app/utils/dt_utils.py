import datetime


def parse_datetime(dt_string, format):
    dt_obj = datetime.datetime.fromisoformat(dt_string)
    return dt_obj.strftime(format)


def parse_date(dt_string, format):
    dt_obj = datetime.datetime.strptime(dt_string, "%Y-%m-%d")
    return dt_obj.strftime(format)


def parse_time(dt_string, format):
    if len(dt_string.split(':')) == 2:
        dt_string += ":00"

    dt_obj = datetime.datetime.strptime(dt_string, "%H:%M:%S")

    return dt_obj.strftime(format)
