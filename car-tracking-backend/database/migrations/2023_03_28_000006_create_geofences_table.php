<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('geofences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['circle', 'polygon'])->default('circle');
            $table->decimal('latitude', 10, 7)->nullable(); // Center for circle
            $table->decimal('longitude', 10, 7)->nullable(); // Center for circle
            $table->decimal('radius', 10, 2)->nullable(); // In meters, for circle
            $table->json('coordinates')->nullable(); // For polygon
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('geofence_vehicle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('geofence_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('geofence_vehicle');
        Schema::dropIfExists('geofences');
    }
}; 