<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Haruncpi\LaravelIdGenerator\IdGenerator;

class Project extends Model
{
    use HasFactory;

    protected $fillable=[
       'number', 'project_name', 'status', 'prefix_number'
    ];

    public function projectDetails(){
        return $this->hasMany(ProjectDetail::class, 'project_id', 'id');
    }

//    public static function boot()
//   {
//       parent::boot();
//       self::creating(function ($projectName) {
//           $projectName->number = IdGenerator::generate(['table' => 'project_names', 'length' => 5, 'prefix' => '0']);
//       });
//   }
}
