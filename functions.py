import csv
from pathlib import Path

CSV_FILE = "file_payments.csv"
CSV_HEADERS = ["Descripcion", "Monto", "Categoria", "Estado", "Fecha"]

payments = []


# -------------------------
# AGREGAR PAGO
# -------------------------
def add_payment(description, cost, category, status, date):
    payments.append([
        description.strip(),
        float(cost),
        category,
        status,
        date
    ])


# -------------------------
# CALCULAR TOTAL
# -------------------------
def calculate_total():
    return sum(float(p[1]) for p in payments)


# -------------------------
# CALCULAR TOTAL FILTRADO
# -------------------------
def calculate_total_filtered(filtered):
    return sum(float(p[1]) for p in filtered)


# -------------------------
# GUARDAR CSV
# -------------------------
def save_csv():
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(CSV_HEADERS)
        writer.writerows(payments)


# -------------------------
# CARGAR CSV
# -------------------------
def load_csv():
    payments.clear()
    if not Path(CSV_FILE).exists():
        return
    with open(CSV_FILE, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        next(reader, None)  # saltar encabezado
        for row in reader:
            if len(row) == 5:
                payments.append([
                    row[0],
                    float(row[1]),
                    row[2],
                    row[3],
                    row[4]
                ])


# -------------------------
# ELIMINAR PAGO
# -------------------------
def delete_payment(index):
    if 0 <= index < len(payments):
        payments.pop(index)


# -------------------------
# MODIFICAR PAGO
# -------------------------
def modify_payment(index, description, cost, category, status, date):
    if 0 <= index < len(payments):
        payments[index] = [
            description.strip(),
            float(cost),
            category,
            status,
            date
        ]


# -------------------------
# FILTRAR PAGOS
# -------------------------
def filter_payments(category_filter="Todas", status_filter="Todos"):
    result = payments
    if category_filter != "Todas":
        result = [p for p in result if p[2] == category_filter]
    if status_filter != "Todos":
        result = [p for p in result if p[3] == status_filter]
    return result
