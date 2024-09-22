from sqlalchemy.orm import Session
from app import models
from app.questions import schemas


def list_questions(db: Session, offset: int, size: int):
    total = db.query(models.Question).count()

    return db.query(models.Question).offset(offset).limit(size).all(), total


def get_questions_by_bot_id(db: Session, bot_id: str):
    return db.query(models.Question).filter(models.Question.bot_id == bot_id).order_by(models.Question.question_order).all()


def get_question(db: Session, question_id: str):
    return db.query(models.Question).filter(models.Question.id == question_id).first()


def create_question(db: Session, question: schemas.QuestionCreate, user_id: str):
    db_question = models.Question(
        **question.dict(exclude={"options"}), created_by=user_id)
    db.add(db_question)
    db.flush()

    for option in question.options:
        db_option = models.QuestionOption(
            **option.dict(), question_id=db_question.id)
        db.add(db_option)

    db.commit()
    db.refresh(db_question)
    return db_question


def update_question(db: Session, question_id: str, question_update: schemas.QuestionUpdate):
    db_question = get_question(db, question_id)
    if db_question:
        question_data = question_update.dict(exclude_unset=True)
        for key, value in question_data.items():
            if key != "options":
                setattr(db_question, key, value)

        if "options" in question_data:
            # Delete existing options
            db.query(models.QuestionOption).filter(
                models.QuestionOption.question_id == question_id).delete()

            # Add new options
            for option in question_update.options:
                db_option = models.QuestionOption(
                    **option.dict(), question_id=question_id)
                db.add(db_option)

        db.commit()
        db.refresh(db_question)

    return db_question


def delete_question(db: Session, question_id: str):
    db_question = get_question(db, question_id)

    if db_question:
        db.delete(db_question)
        db.commit()
        return db_question

    return None


def list_question_options(db: Session, offset: int, size: int, question_id: str = None):
    total = 0
    query_result = None
    if question_id == None:
        total = db.query(models.QuestionOption).filter(
            models.QuestionOption.question_id == question_id).count()
        query_result = db.query(models.QuestionOption).filter(
            models.QuestionOption.question_id == question_id).offset(offset).limit(size).all()

    else:
        total = db.query(models.QuestionOption).count()
        query_result = db.query(models.QuestionOption).offset(
            offset).limit(size).all()

    return query_result, total


def get_question_option(db: Session, option_id: str):
    return db.query(models.QuestionOption).filter(models.QuestionOption.id == option_id).first()


def create_question_option(db: Session, question_id: str, option: schemas.QuestionOptionCreate):
    db_question = get_question(db, question_id)
    if db_question:
        db_option = models.QuestionOption(
            **option.dict(), question_id=question_id)
        db.add(db_option)
        db.commit()
        return db_question, db_option

    return db_question, None


def update_question_option(db: Session, option_id: int, option: schemas.QuestionOptionUpdate):
    db_question = get_question(db, option.question_id)
    if db_question:
        db_option = db.query(models.QuestionOption).filter(
            models.QuestionOption.id == option_id).first()
        if db_option is None:
            for key, value in option.dict().items():
                setattr(db_option, key, value)

            db.commit()
            db.refresh(db_option)
            return db_question, db_option

    return db_question, None


def delete_question_option(db: Session, option_id: int):
    db_option = db.query(models.QuestionOption).filter(
        models.QuestionOption.id == option_id).first()

    if db_option:
        db.delete(db_option)
        db.commit()
        return db_option

    return None
