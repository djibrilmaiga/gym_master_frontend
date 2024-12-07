import React from 'react';

const Filter = ({ search, setSearch, paymentMethod, setPaymentMethod }) => {
    return (
        <div className="filters">
            <div className="filter-method mb-3">
                <label htmlFor="method">Méthode de paiement: </label>
                <select
                    id="method"
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Toutes</option>
                    <option value="Espece">Espèces</option>
                    <option value="Mobile_Money">Mobile Money</option>
                </select>
            </div>
            <div className="filter-search mb-3">
                <label htmlFor="search">Rechercher par nom ou prénom: </label>
                <input
                    id="search"
                    type="text"
                    className="form-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher..."
                />
            </div>
        </div>
    );
};

export default Filter;
