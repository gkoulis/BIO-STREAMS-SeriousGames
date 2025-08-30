import json

def words_to_json(input_file, output_file):
    # Read words from file
    with open(input_file, "r", encoding="utf-8") as f:
        words = [line.strip() for line in f if line.strip()]

    # Remove duplicates and sort
    unique_sorted = sorted(set(words))

    # Build JSON objects
    data = [
        {"id": word, "texture": f"{word}.png"}
        for word in unique_sorted
    ]

    # Save to file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"JSON written to {output_file}")


# Example usage
if __name__ == "__main__":
    words_to_json("food-ninja-item-list.txt", "output.json")
