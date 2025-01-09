// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ModelMarketplace {
    // Структура, описывающая модель
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint256 totalRating;
        uint256 ratingCount;
    }

    // Маппинг modelId -> Model
    mapping(uint256 => Model) public models;
    // Общее количество моделей
    uint256 public modelCount;

    // Адрес владельца контракта (для вывода средств, если нужна комиссия)
    address public owner;

    // Процент комиссии (например, 1%)
    uint256 public feePercentage = 1;

    // События
    event ModelListed(uint256 modelId, string name, uint256 price, address indexed creator);
    event ModelPurchased(uint256 modelId, address indexed buyer);
    event ModelRated(uint256 modelId, uint8 rating, address indexed rater);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Листинг новой модели
     * @param name Название
     * @param description Описание
     * @param price Цена в wei
     */
    function listModel(
        string memory name,
        string memory description,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than zero");

        modelCount++;
        models[modelCount] = Model({
            name: name,
            description: description,
            price: price,
            creator: payable(msg.sender),
            totalRating: 0,
            ratingCount: 0
        });

        emit ModelListed(modelCount, name, price, msg.sender);
    }

    /**
     * @dev Покупка модели
     * @param modelId ID модели
     */
    function purchaseModel(uint256 modelId) external payable {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment amount");
        require(msg.sender != model.creator, "Creator cannot buy their own model");

        // Рассчитываем комиссию
        uint256 fee = (msg.value * feePercentage) / 100;

        // Переводим оплату создателю модели
        model.creator.transfer(msg.value - fee);

        emit ModelPurchased(modelId, msg.sender);
    }

    /**
     * @dev Оценка модели
     * @param modelId ID модели
     * @param rating Оценка (1–5)
     */
    function rateModel(uint256 modelId, uint8 rating) external {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        // В реальной версии нужно проверить, купил ли пользователь модель
        // Здесь пропущено для простоты

        Model storage model = models[modelId];
        model.ratingCount++;
        model.totalRating += rating;

        emit ModelRated(modelId, rating, msg.sender);
    }

    /**
     * @dev Вывод средств владельцем контракта (собранные комиссии)
     */
    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner).transfer(balance);
    }

    /**
     * @dev Возвращает детали указанной модели
     * @param modelId ID модели
     * @return name_ Название
     * @return description_ Описание
     * @return price_ Цена
     * @return creator_ Адрес создателя
     * @return avgRating_ Средний рейтинг
     */
    function getModelDetails(uint256 modelId)
        external
        view
        returns (
            string memory name_,
            string memory description_,
            uint256 price_,
            address creator_,
            uint256 avgRating_
        )
    {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        Model storage model = models[modelId];
        uint256 avgRating = 0;
        if (model.ratingCount > 0) {
            avgRating = model.totalRating / model.ratingCount;
        }
        return (
            model.name,
            model.description,
            model.price,
            model.creator,
            avgRating
        );
    }
}
